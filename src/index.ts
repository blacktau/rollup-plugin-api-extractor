import { NormalizedOutputOptions, PluginImpl } from 'rollup'
import * as path from 'path'
import * as fs from 'fs'

import {
  Extractor,
  ExtractorConfig,
  ExtractorResult,
  IConfigFile,
  IExtractorConfigPrepareOptions
} from '@microsoft/api-extractor'

export interface Options {
  /**
   * The path to the api extractor configuration file. defaults to ./config/api-extractor.json
   */
  configFile?: string

  /**
   * Configuration overrides for the the api extractor configuration. if no config file is specified and the default file does not exist all mandatory configuration sections need to be supplied here. 
   */
  configuration?: Partial<IConfigFile>

  /**
   * Indicates that API Extractor is running as part of a local build, e.g. on a developer's machine
   */
  local?: boolean

  /**
   * Show additional api-extractor messages in the output
   */
  verbose?: boolean

  /**
   * Show diagnostic messages used for troubleshooting problems with API Extractor.
   */
  diagnostics?: boolean

  /**
   * Override the typescript version that api-extractor uses. see [api-extractor documantation for more information])(https://api-extractor.com/pages/commands/api-extractor_run/)
   */
  typescriptFolder?: string
}

const cleanEmptyFoldersRecursively = (folder: string) => {
  var isDir = fs.statSync(folder).isDirectory();
  if (!isDir) {
    return;
  }
  var files = fs.readdirSync(folder);
  if (files.length > 0) {
    files.forEach(function(file) {
      var fullPath = path.join(folder, file);
      cleanEmptyFoldersRecursively(fullPath);
    });

    // re-evaluate files; after deleting subfolder
    // we may have parent folder empty now
    files = fs.readdirSync(folder);
  }

  if (files.length == 0) {
    fs.rmdirSync(folder);
    return;
  }
}

const getTypings = (packageJson: any) => {
  let types: string = packageJson['types'] ?? packageJson['typings']

  if (types) {
    if (types.endsWith('.js')) {
      types = `${types.substr(0, -3)}.d.ts`
    } 
  } else {
    let main = packageJson['main']
    types = `${main.substr(0, -3)}.d.ts`
  }

  if (!types) {
    types = 'index.d.ts'
  }

  if (!fs.existsSync(path.join(__dirname, types))) {
    throw new Error('Unable to find typings file. Is it defined in package.json?')
  }

  return types
}

const plugin: PluginImpl<Options> = (pluginOptions = {}) => {

  return {
    name: 'api-extractor',
    writeBundle: (options: NormalizedOutputOptions, bundle) => {

      const apiExtractorJsonPath: string = path.join(__dirname, pluginOptions.configFile ?? './config/api-extractor.json')
      const outdir = path.resolve(options.dir ?? './')

      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

      const aeConfig: IConfigFile = fs.existsSync(apiExtractorJsonPath) ? {
        ...ExtractorConfig.loadFile(apiExtractorJsonPath),
        ...pluginOptions.configuration
      } : {
        mainEntryPointFilePath: getTypings(packageJson),
        ...pluginOptions.configuration
      }
     
      const prepareOptions: IExtractorConfigPrepareOptions = {
        configObject: aeConfig,
        configObjectFullPath: undefined,
        packageJsonFullPath: path.resolve(__dirname, 'package.json')
      }

      const extractorConfig: ExtractorConfig = ExtractorConfig.prepare(prepareOptions)
        
      const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig,
        {
          localBuild: pluginOptions.local ?? false,
          showVerboseMessages: pluginOptions.verbose ?? false,
          showDiagnostics: pluginOptions.diagnostics ?? false,
          typescriptCompilerFolder: pluginOptions.typescriptFolder
      })
  
      if (extractorResult.succeeded) {
        if (bundle && extractorConfig.rollupEnabled) {
          const defs = Object.keys(bundle).filter((key) => key.match(/\.d\.ts/))
          defs.forEach((def) => {
            const defRef = bundle[def]
            if (defRef) {
              const fileName = path.resolve(outdir, defRef.fileName)
              if (fileName !== extractorConfig.untrimmedFilePath) {
                fs.unlinkSync(fileName)
              }
            }
          })
          
          cleanEmptyFoldersRecursively(outdir)
        }

        process.exitCode = 0;
      } else {
        console.error(`API Extractor completed with ${extractorResult.errorCount} errors`
          + ` and ${extractorResult.warningCount} warnings`);
        process.exitCode = 1;
      }
    } 
  }
}

export default plugin