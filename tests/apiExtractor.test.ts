import { apiExtractor } from '../src/index'
import { Mock } from 'ts-mockery'

describe('apiExtractor', () => {
  beforeEach(() => {
    global.console = Mock.of<Console>({
      warn: jest.fn(),
      log: jest.fn()
    })
  })

  it('should return a plugin named api-extractor', () => {
    const plugin = apiExtractor()
    expect(plugin.name).toBe('api-extractor')
  })

  it('should expose a writeBundle function', () => {
    const plugin = apiExtractor()
    expect(plugin.writeBundle).toBeInstanceOf(Function)
  })
})
