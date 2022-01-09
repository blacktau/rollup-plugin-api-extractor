import { NormalizedOutputOptions, OutputBundle } from 'rollup'
import { ExtractorConfig } from '@microsoft/api-extractor'
import { removeEmptyFolders } from './removeEmptyFolders'
import { fileSys } from './fileSys'

export const performDtsRollupCleanup = (bundle: OutputBundle, extractorConfig: ExtractorConfig, options: NormalizedOutputOptions) => {
  if (!bundle || !extractorConfig.rollupEnabled) {
    return
  }

  const outDir = fileSys.resolve(options.dir ?? './')

  const outDefs: string[] = []

  pushIfDefined(extractorConfig.untrimmedFilePath, outDir, outDefs)
  pushIfDefined(extractorConfig.betaTrimmedFilePath, outDir, outDefs)
  pushIfDefined(extractorConfig.publicTrimmedFilePath, outDir, outDefs)

  Object.keys(bundle).filter((key) => key.match(/\.d\.ts/)).forEach((def) => {
    const defRef = bundle[def]

    if (defRef) {
      const fileName = fileSys.resolve(outDir, defRef.fileName)
      if (!outDefs.includes(fileName)) {
        fileSys.unlinkSync(fileName)
      }
    }
  })

  removeEmptyFolders(outDir)
}

const pushIfDefined = (filePath: string | undefined, outDir: string, outDefs: string[]) => {
  if (filePath) {
    outDefs.push(fileSys.resolve(outDir, filePath))
  }
}
