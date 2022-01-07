import { Extractor, ExtractorConfig, ExtractorMessage, ExtractorResult, IConfigFile, IExtractorInvokeOptions } from '@microsoft/api-extractor'
import { PluginContext } from 'rollup'
import { Mock } from 'ts-mockery'
import { fileSys } from '../src/fileSys'
import { ApiExtractorPluginOptions } from '../src/index'
import { invokeApiExtractor } from '../src/invokeApiExtractor'
import * as handleApiExtractorMessages from '../src/handleApiExtractorMessages'

describe('invokeApiExtractor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('should result the prepared config and extractor result', () => {
    const context = Mock.all<PluginContext>()
    const config = Mock.all<IConfigFile>()
    const options = Mock.all<ApiExtractorPluginOptions>()
    const mockExtractorConfig = Mock.all<ExtractorConfig>()
    const mockExtractorResult = Mock.all<ExtractorResult>()

    Mock.staticMethod(ExtractorConfig, 'prepare', () => mockExtractorConfig)
    Mock.staticMethod(Extractor, 'invoke', () => mockExtractorResult)

    const { extractorResult, extractorConfig } = invokeApiExtractor(context, config, options)

    expect(extractorConfig).toBe(mockExtractorConfig)
    expect(extractorResult).toBe(mockExtractorResult)
  })

  it('should set the packageJson location', () => {
    const context = Mock.all<PluginContext>()
    const config = Mock.all<IConfigFile>()
    const options = Mock.all<ApiExtractorPluginOptions>()
    const mockExtractorConfig = Mock.all<ExtractorConfig>()
    const mockExtractorResult = Mock.all<ExtractorResult>()

    Mock.staticMethod(ExtractorConfig, 'prepare', () => mockExtractorConfig)
    Mock.staticMethod(Extractor, 'invoke', () => mockExtractorResult)
    Mock.staticMethod(fileSys, 'resolve', () => 'path/to/package.json')

    invokeApiExtractor(context, config, options)

    expect(ExtractorConfig.prepare).toHaveBeenCalledWith(expect.objectContaining({
      packageJsonFullPath: 'path/to/package.json'
    }))
  })

  it('should use the supplied configuration object', () => {
    const context = Mock.all<PluginContext>()
    const config = Mock.all<IConfigFile>()
    const options = Mock.all<ApiExtractorPluginOptions>()
    const mockExtractorConfig = Mock.all<ExtractorConfig>()
    const mockExtractorResult = Mock.all<ExtractorResult>()

    Mock.staticMethod(ExtractorConfig, 'prepare', () => mockExtractorConfig)
    Mock.staticMethod(Extractor, 'invoke', () => mockExtractorResult)
    Mock.staticMethod(fileSys, 'resolve', () => 'path/to/package.json')

    invokeApiExtractor(context, config, options)

    expect(ExtractorConfig.prepare).toHaveBeenCalledWith(expect.objectContaining({
      configObject: config,
      configObjectFullPath: undefined
    }))
  })

  it.each([[false], [true]])('should set the localBuild based on the options', (localMode) => {
    const context = Mock.all<PluginContext>()
    const config = Mock.all<IConfigFile>()
    const options = Mock.of<ApiExtractorPluginOptions>({
      local: localMode
    })

    const mockExtractorConfig = Mock.of<ExtractorConfig>({
      docModelEnabled: true
    })

    const mockExtractorResult = Mock.all<ExtractorResult>()

    Mock.staticMethod(ExtractorConfig, 'prepare', () => mockExtractorConfig)
    Mock.staticMethod(Extractor, 'invoke', () => mockExtractorResult)
    Mock.staticMethod(fileSys, 'resolve', () => 'path/to/package.json')

    invokeApiExtractor(context, config, options)

    expect(Extractor.invoke)
      .toHaveBeenCalledWith<[ExtractorConfig, IExtractorInvokeOptions]>(
      expect.anything(),
      expect.objectContaining({
        localBuild: localMode
      })
    )
  })

  it.each([[false], [true]])('should default the localBuild to rollup watch mode if not provided in config', (watchMode) => {
    const context = Mock.of<PluginContext>({
      meta: {
        watchMode: watchMode
      }
    })

    const config = Mock.all<IConfigFile>()
    const options = Mock.of<ApiExtractorPluginOptions>({
      local: undefined
    })

    const mockExtractorConfig = Mock.of<ExtractorConfig>({
      docModelEnabled: true
    })

    const mockExtractorResult = Mock.all<ExtractorResult>()

    Mock.staticMethod(ExtractorConfig, 'prepare', () => mockExtractorConfig)
    Mock.staticMethod(Extractor, 'invoke', () => mockExtractorResult)
    Mock.staticMethod(fileSys, 'resolve', () => 'path/to/package.json')

    invokeApiExtractor(context, config, options)

    expect(Extractor.invoke)
      .toHaveBeenCalledWith<[ExtractorConfig, IExtractorInvokeOptions]>(
      expect.anything(),
      expect.objectContaining({
        localBuild: watchMode
      })
    )
  })

  it.each([[false], [true], [undefined]])('should set verbosity based on plugin options', (verbosityMode) => {
    const context = Mock.of<PluginContext>()

    const config = Mock.all<IConfigFile>()
    const options = Mock.of<ApiExtractorPluginOptions>({
      verbose: verbosityMode
    })

    const mockExtractorConfig = Mock.of<ExtractorConfig>({
      docModelEnabled: true
    })

    const mockExtractorResult = Mock.all<ExtractorResult>()

    Mock.staticMethod(ExtractorConfig, 'prepare', () => mockExtractorConfig)
    Mock.staticMethod(Extractor, 'invoke', () => mockExtractorResult)
    Mock.staticMethod(fileSys, 'resolve', () => 'path/to/package.json')

    invokeApiExtractor(context, config, options)

    expect(Extractor.invoke)
      .toHaveBeenCalledWith<[ExtractorConfig, IExtractorInvokeOptions]>(
      expect.anything(),
      expect.objectContaining({
        showVerboseMessages: verbosityMode
      })
    )
  })

  it.each([[false], [true], [undefined]])('should set diagnostics based on plugin options', (diagnosticsMode) => {
    const context = Mock.of<PluginContext>()

    const config = Mock.all<IConfigFile>()
    const options = Mock.of<ApiExtractorPluginOptions>({
      diagnostics: diagnosticsMode
    })

    const mockExtractorConfig = Mock.of<ExtractorConfig>({
      docModelEnabled: true
    })

    const mockExtractorResult = Mock.all<ExtractorResult>()

    Mock.staticMethod(ExtractorConfig, 'prepare', () => mockExtractorConfig)
    Mock.staticMethod(Extractor, 'invoke', () => mockExtractorResult)
    Mock.staticMethod(fileSys, 'resolve', () => 'path/to/package.json')

    invokeApiExtractor(context, config, options)

    expect(Extractor.invoke)
      .toHaveBeenCalledWith<[ExtractorConfig, IExtractorInvokeOptions]>(
      expect.anything(),
      expect.objectContaining({
        showDiagnostics: diagnosticsMode
      })
    )
  })

  it('should set typescriptFolder if on plugin options', () => {
    const typescriptFolder = 'expected/typescript/folder'
    const context = Mock.of<PluginContext>()
    const config = Mock.all<IConfigFile>()

    const options = Mock.of<ApiExtractorPluginOptions>({
      typescriptFolder: typescriptFolder
    })

    const mockExtractorConfig = Mock.of<ExtractorConfig>({
      docModelEnabled: true
    })

    const mockExtractorResult = Mock.all<ExtractorResult>()

    Mock.staticMethod(ExtractorConfig, 'prepare', () => mockExtractorConfig)
    Mock.staticMethod(Extractor, 'invoke', () => mockExtractorResult)
    Mock.staticMethod(fileSys, 'resolve', () => 'path/to/package.json')

    invokeApiExtractor(context, config, options)

    expect(Extractor.invoke)
      .toHaveBeenCalledWith<[ExtractorConfig, IExtractorInvokeOptions]>(
      expect.anything(),
      expect.objectContaining({
        typescriptCompilerFolder: typescriptFolder
      })
    )
  })

  it('should set messageCallback to call handleApiExtractorMessages', () => {
    const context = Mock.of<PluginContext>()
    const mockedConfigFile = Mock.all<IConfigFile>()
    const mockedPluginOptions = Mock.of<ApiExtractorPluginOptions>()

    const mockExtractorConfig = Mock.of<ExtractorConfig>({
      docModelEnabled: true
    })

    const mockExtractorResult = Mock.all<ExtractorResult>()

    Mock.staticMethod(ExtractorConfig, 'prepare', () => mockExtractorConfig)
    Mock.staticMethod(Extractor, 'invoke', () => mockExtractorResult)
    Mock.staticMethod(fileSys, 'resolve', () => 'path/to/package.json')
    Mock.staticMethod(handleApiExtractorMessages, 'handleApiExtractorMessages', jest.fn())

    invokeApiExtractor(context, mockedConfigFile, mockedPluginOptions)

    
    const parameters = jest.mocked(Extractor.invoke).mock.calls[0]
    expect(parameters?.[1]?.messageCallback).toBeDefined()

    if (parameters?.[1]?.messageCallback) {
      parameters[1].messageCallback(Mock.all<ExtractorMessage>())
    }

    expect(handleApiExtractorMessages.handleApiExtractorMessages).toHaveBeenCalled()
  })
})
