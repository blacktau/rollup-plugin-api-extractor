import { NormalizedOutputOptions, OutputBundle } from 'rollup'
import { ExtractorConfig } from '@microsoft/api-extractor'
import { removeEmptyFolders } from './removeEmptyFolders'
import { fileSys } from './fileSys'

export const performDtsRollupCleanup = (bundle: OutputBundle, extractorConfig: ExtractorConfig, options: NormalizedOutputOptions) => {
  if (!bundle || !extractorConfig.rollupEnabled) {
    return
  }

  const outdir = fileSys.resolve(options.dir ?? './')

  const outDefs: string[] = []

  pushIfDefined(extractorConfig.untrimmedFilePath, outdir, outDefs)
  pushIfDefined(extractorConfig.betaTrimmedFilePath, outdir, outDefs)
  pushIfDefined(extractorConfig.publicTrimmedFilePath, outdir, outDefs)

  Object.keys(bundle).filter((key) => key.match(/\.d\.ts/)).forEach((def) => {
    const defRef = bundle[def]

    if (defRef) {
      const fileName = fileSys.resolve(outdir, defRef.fileName)
      if (!outDefs.includes(fileName)) {
        fileSys.unlinkSync(fileName)
      }
    }
  })

  removeEmptyFolders(outdir)
}

const pushIfDefined = (filePath: string | undefined, outdir: string, outDefs: string[]) => {
  if (filePath) {
    outDefs.push(fileSys.resolve(outdir, filePath))
  }
}
