import { ExtractorConfig, IConfigFile } from '@microsoft/api-extractor'
import { getTypings } from './getTypings'
import { ApiExtractorPluginOptions } from './index'
import { fileSys } from './fileSys'

export const getApiExtractorConfig = (pluginOptions: ApiExtractorPluginOptions): IConfigFile => {
  const apiExtractorJsonPath: string = fileSys.resolve(pluginOptions.configFile ?? './config/api-extractor.json')

  let aeConfig: Partial<IConfigFile> = {}

  if (!fileSys.existsSync(apiExtractorJsonPath) && !pluginOptions.configuration) {
    throw new Error(`configuration not specified and configuration file ${apiExtractorJsonPath} not found.`)
  }

  if (fileSys.existsSync(apiExtractorJsonPath)) {
    aeConfig = {
      ...ExtractorConfig.loadFile(apiExtractorJsonPath),
      ...pluginOptions.configuration
    }
  } else {
    aeConfig = {
      ...pluginOptions.configuration
    }
  }

  if (!aeConfig.mainEntryPointFilePath) {
    const typingsFile = getTypings()

    if (typingsFile) {
      aeConfig = {
        ...aeConfig,
        ...pluginOptions.configuration,
        mainEntryPointFilePath: typingsFile
      }
    } else {
      throw new Error('Unable to auto-resolve mainEntryPointFilePath. Please add typings it your package.json')
    }
  }

  return aeConfig as IConfigFile
}
