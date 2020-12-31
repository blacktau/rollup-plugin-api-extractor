import { NormalizedOutputOptions, OutputBundle, Plugin, PluginImpl } from 'rollup'
import { IConfigFile } from '@microsoft/api-extractor'
import { getApiExtractorConfig } from './getApiExtractorConfig'
import { invokeApiExtractor } from './invokeApiExtractor'
import { performDtsRollupCleanup } from './performDtsRollupCleanup'

export interface ApiExtractorPluginOptions {
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

export const apiExtractor: PluginImpl<ApiExtractorPluginOptions> = (pluginOptions = {}): Plugin => {
  return {
    name: 'api-extractor',
    writeBundle (options: NormalizedOutputOptions, bundle: OutputBundle) {
      const aeConfig = getApiExtractorConfig(pluginOptions)

      if (!aeConfig) {
        this.error('Unable to find typings file. Is it defined in package.json?')
      }

      const { extractorResult, extractorConfig } = invokeApiExtractor(this, aeConfig, pluginOptions)

      if (!extractorResult.succeeded) {
        if (extractorResult.errorCount > 0) {
          this.error(`API Extractor completed with ${extractorResult.errorCount} errors and ${extractorResult.warningCount} warnings`)
        } else {
          this.warn(`API Extractor completed with ${extractorResult.warningCount} warnings`)
        }

        return
      }

      performDtsRollupCleanup(bundle, extractorConfig, options)
    }
  }
}
