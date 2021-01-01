import { apiExtractor, ApiExtractorPluginOptions } from '../src/index'
import { Mock } from 'ts-mockery'
import * as aecModule from '../src/getApiExtractorConfig'
import * as iaeModule from '../src/invokeApiExtractor'
import * as pdrcModule from '../src/performDtsRollupCleanup'

import { NormalizedOutputOptions, OutputBundle, PluginContext } from 'rollup'
import { ExtractorConfig, ExtractorResult, IConfigFile } from '@microsoft/api-extractor'

describe('apiExtractor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('should return a plugin named api-extractor', () => {
    const plugin = apiExtractor()
    expect(plugin.name).toBe('api-extractor')
  })

  it('should expose a writeBundle function', () => {
    const plugin = apiExtractor()
    expect(plugin.writeBundle).toBeInstanceOf(Function)
  })

  describe('writeBundle', () => {
    it('should build the Api Extractor config with supplied plugin options', () => {
      Mock.staticMethod(aecModule, 'getApiExtractorConfig', () => Mock.of<IConfigFile>())
      Mock.staticMethod(iaeModule, 'invokeApiExtractor', () => {
        return {
          extractorResult: Mock.of<ExtractorResult>(),
          extractorConfig: Mock.of<ExtractorConfig>()
        }
      })

      const pluginOptions = Mock.of<ApiExtractorPluginOptions>()
      const plugin = apiExtractor(pluginOptions)
      const outputOptions = Mock.all<NormalizedOutputOptions>()
      const outputBundle = Mock.all<OutputBundle>()

      const context = Mock.all<PluginContext>()
      const mappedPlugin = Object.assign(context, plugin)

      if (mappedPlugin.writeBundle) {
        void mappedPlugin.writeBundle(outputOptions, outputBundle)
      }

      expect(aecModule.getApiExtractorConfig).toHaveBeenCalledWith(pluginOptions)
    })

    it('should report errors and warnings count if extraction failed', () => {
      Mock.staticMethod(aecModule, 'getApiExtractorConfig', () => Mock.of<IConfigFile>())
      Mock.staticMethod(iaeModule, 'invokeApiExtractor', () => {
        return {
          extractorResult: Mock.of<ExtractorResult>({
            succeeded: false,
            errorCount: 10,
            warningCount: 5
          }),
          extractorConfig: Mock.of<ExtractorConfig>()
        }
      })

      const pluginOptions = Mock.of<ApiExtractorPluginOptions>()
      const plugin = apiExtractor(pluginOptions)
      const outputOptions = Mock.all<NormalizedOutputOptions>()
      const outputBundle = Mock.all<OutputBundle>()

      const context = Mock.all<PluginContext>()
      const mappedPlugin = Object.assign(context, plugin)

      if (mappedPlugin.writeBundle) {
        void mappedPlugin.writeBundle(outputOptions, outputBundle)
      }

      expect(mappedPlugin.error).toHaveBeenCalledWith('API Extractor completed with 10 errors and 5 warnings')
    })

    it('should report only warnings count if extraction failed with only warnigns', () => {
      Mock.staticMethod(aecModule, 'getApiExtractorConfig', () => Mock.of<IConfigFile>())
      Mock.staticMethod(iaeModule, 'invokeApiExtractor', () => {
        return {
          extractorResult: Mock.of<ExtractorResult>({
            succeeded: false,
            errorCount: 0,
            warningCount: 5
          }),
          extractorConfig: Mock.of<ExtractorConfig>()
        }
      })

      const pluginOptions = Mock.of<ApiExtractorPluginOptions>()
      const plugin = apiExtractor(pluginOptions)
      const outputOptions = Mock.all<NormalizedOutputOptions>()
      const outputBundle = Mock.all<OutputBundle>()

      const context = Mock.all<PluginContext>()
      const mappedPlugin = Object.assign(context, plugin)

      if (mappedPlugin.writeBundle) {
        void mappedPlugin.writeBundle(outputOptions, outputBundle)
      }

      expect(mappedPlugin.warn).toHaveBeenCalledWith('API Extractor completed with 5 warnings')
    })

    it('should run a dts clean up if extraction succeeded', () => {
      Mock.staticMethod(aecModule, 'getApiExtractorConfig', () => Mock.of<IConfigFile>())
      Mock.staticMethod(pdrcModule, 'performDtsRollupCleanup', jest.fn())
      Mock.staticMethod(iaeModule, 'invokeApiExtractor', () => {
        return {
          extractorResult: Mock.of<ExtractorResult>({
            succeeded: true
          }),
          extractorConfig: Mock.of<ExtractorConfig>()
        }
      })

      const pluginOptions = Mock.of<ApiExtractorPluginOptions>()
      const plugin = apiExtractor(pluginOptions)
      const outputOptions = Mock.all<NormalizedOutputOptions>()
      const outputBundle = Mock.all<OutputBundle>()

      const context = Mock.all<PluginContext>()
      const mappedPlugin = Object.assign(context, plugin)

      if (mappedPlugin.writeBundle) {
        void mappedPlugin.writeBundle(outputOptions, outputBundle)
      }

      expect(pdrcModule.performDtsRollupCleanup).toHaveBeenCalled()
    })
  })
})
