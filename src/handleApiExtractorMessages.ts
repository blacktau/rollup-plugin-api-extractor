import { PluginContext } from 'rollup'
import { ExtractorLogLevel, ExtractorMessage } from '@microsoft/api-extractor'

export const handleApiExtractorMessages = (context: PluginContext, message: ExtractorMessage) => {
  if (message.logLevel === ExtractorLogLevel.Error) {
    context.error(message.formatMessageWithLocation(__dirname), {
      column: message.sourceFileColumn ?? -1,
      line: message.sourceFileLine ?? -1
    })
  } else {
    context.warn(message.formatMessageWithLocation(__dirname), {
      column: message.sourceFileColumn ?? -1,
      line: message.sourceFileLine ?? -1
    })
  }
}
