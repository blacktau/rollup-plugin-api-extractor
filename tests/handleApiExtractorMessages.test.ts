import { ExtractorLogLevel, ExtractorMessage } from '@microsoft/api-extractor'
import { PluginContext } from 'rollup'
import { Mock } from 'ts-mockery'
import { handleApiExtractorMessages } from '../src/handleApiExtractorMessages'

describe('handleApiExtractorMessages', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  it('should call context.error for error messages', () => {
    const context = Mock.all<PluginContext>()
    const message = Mock.all<ExtractorMessage>()
    Mock.extend(message).with({
      logLevel: ExtractorLogLevel.Error
    })

    handleApiExtractorMessages(context, message)

    expect(context.error).toHaveBeenCalled()
    expect(context.warn).not.toHaveBeenCalled()
  })

  it('should call context.warn for anything not error messages', () => {
    const context = Mock.all<PluginContext>()
    const message = Mock.all<ExtractorMessage>()
    Mock.extend(message).with({
      logLevel: ExtractorLogLevel.Verbose
    })

    handleApiExtractorMessages(context, message)

    expect(context.warn).toHaveBeenCalled()
    expect(context.error).not.toHaveBeenCalled()
  })

  it('should set the column and line for the error', () => {
    const context = Mock.all<PluginContext>()
    const message = Mock.of<ExtractorMessage>({
      logLevel: ExtractorLogLevel.Error,
      sourceFileColumn: 42,
      sourceFileLine: 64,
      formatMessageWithLocation: () => ''
    })

    handleApiExtractorMessages(context, message)

    expect(context.error)
      .toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        column: 42,
        line: 64
      }))
  })

  it('should set the column and line for the warning', () => {
    const context = Mock.all<PluginContext>()
    const message = Mock.of<ExtractorMessage>({
      logLevel: ExtractorLogLevel.Info,
      sourceFileColumn: 42,
      sourceFileLine: 64,
      formatMessageWithLocation: () => ''
    })

    handleApiExtractorMessages(context, message)

    expect(context.warn)
      .toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        column: 42,
        line: 64
      }))
  })

  it('should set the column and line -1 if theyre undefined (not error)', () => {
    const context = Mock.all<PluginContext>()
    const message = Mock.of<ExtractorMessage>({
      logLevel: ExtractorLogLevel.Warning,
      sourceFileColumn: undefined,
      sourceFileLine: undefined,
      formatMessageWithLocation: () => ''
    })

    handleApiExtractorMessages(context, message)

    expect(context.warn)
      .toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        column: -1,
        line: -1
      }))
  })

  it('should set the column and line -1 if theyre undefined (error)', () => {
    const context = Mock.all<PluginContext>()
    const message = Mock.of<ExtractorMessage>({
      logLevel: ExtractorLogLevel.Error,
      sourceFileColumn: undefined,
      sourceFileLine: undefined,
      formatMessageWithLocation: () => ''
    })

    handleApiExtractorMessages(context, message)

    expect(context.error)
      .toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        column: -1,
        line: -1
      }))
  })
})
