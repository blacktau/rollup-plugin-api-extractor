import { ExtractorConfig, IConfigFile } from '@microsoft/api-extractor'
import { Mock } from 'ts-mockery'
import { ApiExtractorPluginOptions } from '../src'
import { getApiExtractorConfig } from '../src/getApiExtractorConfig'
import * as getTypings from '../src/getTypings'
import { fileSys } from '../src/fileSys'

const configFilePath = './tests/fixtures/api-extractor.json'

describe('getApiExtractorConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('should load the configfile in the pluginOptions if supplied and exists', () => {
    Mock.staticMethod(ExtractorConfig, 'loadFile', (): IConfigFile => {
      const configMock = Mock.all<IConfigFile>()
      Mock.extend(configMock).with({
        mainEntryPointFilePath: ''
      })

      return configMock
    })

    Mock.staticMethod(fileSys, 'resolve', (path) => path)
    Mock.staticMethod(fileSys, 'existsSync', () => true)

    const options: ApiExtractorPluginOptions = {
      configFile: configFilePath
    }

    const result = getApiExtractorConfig(options)

    expect(ExtractorConfig.loadFile).toHaveBeenCalledWith(configFilePath)
    expect(result).toBeDefined()
  })

  it('should override the configfile with the supplied config', () => {
    Mock.staticMethod(ExtractorConfig, 'loadFile', (): IConfigFile => {
      const configFile = Mock.all<IConfigFile>()
      Mock.extend(configFile).with({
        projectFolder: 'file/project/Folder',
        mainEntryPointFilePath: ''
      })

      return configFile
    })

    Mock.staticMethod(fileSys, 'resolve', (path) => path)
    Mock.staticMethod(fileSys, 'existsSync', () => true)

    const options: ApiExtractorPluginOptions = {
      configFile: configFilePath,
      configuration: {
        projectFolder: 'configured/Project/Folder'
      }
    }

    const result = getApiExtractorConfig(options)

    expect(ExtractorConfig.loadFile).toHaveBeenCalledWith(configFilePath)
    expect(result).toBeDefined()
    expect(result?.projectFolder).toBe(options.configuration?.projectFolder)
  })

  it('should use the default api-extractor config location if config file not supplied', () => {
    Mock.staticMethod(fileSys, 'resolve', (path) => path)
    Mock.staticMethod(fileSys, 'existsSync', () => true)

    Mock.staticMethod(ExtractorConfig, 'loadFile', (): IConfigFile => {
      const configFile = Mock.all<IConfigFile>()
      Mock.extend(configFile).with({
        projectFolder: 'file/project/Folder',
        mainEntryPointFilePath: ''
      })

      return configFile
    })

    const options: ApiExtractorPluginOptions = {
    }

    getApiExtractorConfig(options)

    expect(fileSys.existsSync).toHaveBeenCalledWith('./config/api-extractor.json')
  })

  it('should error if configuration not supplied and no config file exists', () => {
    Mock.staticMethod(fileSys, 'resolve', (path) => path)
    Mock.staticMethod(fileSys, 'existsSync', () => false)

    const options: ApiExtractorPluginOptions = {
      configFile: 'not/a/real/config/file'
    }

    expect(() => getApiExtractorConfig(options))
      .toThrowError(`configuration not specified and configuration file ${options.configFile ?? '?'} not found.`)
  })

  it('should use the mainEntryPointFilePath from the configuration if supplied', () => {
    const options: ApiExtractorPluginOptions = {
      configFile: 'not/a/real/config/file',
      configuration: {
        mainEntryPointFilePath: 'the/main/entry/point'
      }
    }

    const result = getApiExtractorConfig(options)

    expect(result?.mainEntryPointFilePath).toBe(options.configuration?.mainEntryPointFilePath)
  })

  it('should try to resolve the mainEntryPointFilePath from getTypings if config file invalid and mainEntryPointFilePath not in supplied configuration', () => {
    const options: ApiExtractorPluginOptions = {
      configFile: 'not/a/real/config/file',
      configuration: {
      }
    }

    Mock.staticMethod(getTypings, 'getTypings', () => 'typings/file.path')

    const result = getApiExtractorConfig(options)

    expect(result?.mainEntryPointFilePath).toBe('typings/file.path')
  })

  it('should throw if the getTypings returns undefined if config file invalid and mainEntryPointFilePath not in supplied configuration', () => {
    const options: ApiExtractorPluginOptions = {
      configFile: 'not/a/real/config/file',
      configuration: {}
    }

    Mock.staticMethod(getTypings, 'getTypings', () => undefined)

    expect(() => getApiExtractorConfig(options)).toThrowError('Unable to auto-resolve mainEntryPointFilePath. Please add typings it your package.json')
  })
})
