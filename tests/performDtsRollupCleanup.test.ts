import { performDtsRollupCleanup } from '../src/performDtsRollupCleanup'
import { Mock } from 'ts-mockery'
import { fileSys } from '../src/fileSys'
import { NormalizedOutputOptions, OutputAsset, OutputBundle } from 'rollup'
import { ExtractorConfig } from '@microsoft/api-extractor'
import * as removeEmptyFolders from '../src/removeEmptyFolders'

describe('performDtsRollupCleanup', () => {
  const createMockAsset = (fileName: string) => Mock.of<OutputAsset>({
    fileName: fileName
  })

  const createMockBundle = (): OutputBundle => {
    return {
      'untrimmedFilePath.d.ts': createMockAsset('untrimmedFilePath.d.ts'),
      'betaTrimmedFilePath.d.ts': createMockAsset('betaTrimmedFilePath.d.ts'),
      'publicTrimmedFilePath.d.ts': createMockAsset('publicTrimmedFilePath.d.ts'),
      'another.d.ts': createMockAsset('another.d.ts')
    }
  }

  it('should remove all type defs except the untrimmedFilePath, betaTrimmedFilePath and publicTrimmedFilePath', () => {
    Mock.staticMethod(fileSys, 'resolve', (...paths) => paths.join('/'))
    Mock.staticMethod(fileSys, 'unlinkSync', jest.fn())
    Mock.staticMethod(removeEmptyFolders, 'removeEmptyFolders', jest.fn())

    const bundle = createMockBundle()
    const options = Mock.of<NormalizedOutputOptions>({
      dir: undefined
    })

    const config = Mock.of<ExtractorConfig>({
      rollupEnabled: true,
      untrimmedFilePath: 'untrimmedFilePath.d.ts',
      betaTrimmedFilePath: 'betaTrimmedFilePath.d.ts',
      publicTrimmedFilePath: 'publicTrimmedFilePath.d.ts'
    })

    performDtsRollupCleanup(bundle, config, options)

    expect(fileSys.unlinkSync).toBeCalledWith(expect.stringMatching('another.d.ts'))
    expect(fileSys.unlinkSync).not.toBeCalledWith(expect.stringMatching('untrimmedFilePath.d.ts'))
    expect(fileSys.unlinkSync).not.toBeCalledWith(expect.stringMatching('betaTrimmedFilePath.d.ts'))
    expect(fileSys.unlinkSync).not.toBeCalledWith(expect.stringMatching('publicTrimmedFilePath.d.ts'))
  })

  it('should not do anything if rollup is not enabled', () => {
    Mock.staticMethod(removeEmptyFolders, 'removeEmptyFolders', jest.fn())
    Mock.staticMethod(fileSys, 'resolve', (...paths) => paths.join('/'))
    Mock.staticMethod(fileSys, 'unlinkSync', jest.fn())

    const bundle = createMockBundle()
    const options = Mock.of<NormalizedOutputOptions>()
    const config = Mock.of<ExtractorConfig>({
      rollupEnabled: false
    })

    performDtsRollupCleanup(bundle, config, options)

    expect(removeEmptyFolders.removeEmptyFolders).not.toBeCalled()
  })
})
