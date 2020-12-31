import { PluginContext } from 'rollup'
import { Extractor, ExtractorConfig, ExtractorResult, IConfigFile, IExtractorConfigPrepareOptions } from '@microsoft/api-extractor'
import { ApiExtractorPluginOptions } from './index'
import { handleApiExtractorMessages } from './handleApiExtractorMessages'
import { fileSys } from './fileSys'

export const invokeApiExtractor = (context: PluginContext, apiExtractorConfig: IConfigFile, pluginOptions: ApiExtractorPluginOptions): { extractorResult: ExtractorResult, extractorConfig: ExtractorConfig } => {
  const packageJsonPath = fileSys.resolve('package.json')

  const prepareOptions: IExtractorConfigPrepareOptions = {
    configObject: apiExtractorConfig,
    configObjectFullPath: undefined,
    packageJsonFullPath: packageJsonPath
  }

  const extractorConfig: ExtractorConfig = ExtractorConfig.prepare(prepareOptions)

  const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig,
    {
      localBuild: (pluginOptions.local ?? context.meta?.watchMode),
      showVerboseMessages: pluginOptions.verbose,
      showDiagnostics: pluginOptions.diagnostics,
      typescriptCompilerFolder: pluginOptions.typescriptFolder,
      messageCallback: (message) => handleApiExtractorMessages(context, message)
    })

  return { extractorResult, extractorConfig }
}
