import { NormalizedOutputOptions, OutputBundle } from 'rollup'
import { ExtractorConfig } from '@microsoft/api-extractor'
import { removeEmptyFolders } from './removeEmptyFolders'
import { fileSys } from './fileSys'

export const performDtsRollupCleanup = (bundle: OutputBundle, extractorConfig: ExtractorConfig, options: NormalizedOutputOptions) => {
  if (!bundle || !extractorConfig.rollupEnabled) {
    return
  }

  const outdir = fileSys.resolve(options.dir ?? './')
  const defs = Object.keys(bundle).filter((key) => key.match(/\.d\.ts/))
  defs.forEach((def) => {
    const defRef = bundle[def]
    if (defRef) {
      const fileName = fileSys.resolve(outdir, defRef.fileName)
      if (fileName !== extractorConfig.untrimmedFilePath) {
        fileSys.unlinkSync(fileName)
      }
    }
  })

  removeEmptyFolders(outdir)
}
