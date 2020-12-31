import { fileSys } from './fileSys'

export const getTypings = () => {
  const packageFile = fileSys.resolve('package.json')
  const packageJson = JSON.parse(fileSys.readFileSync(packageFile, 'utf8'))

  let types: string = (packageJson.types ?? packageJson.typings) ?? packageJson.main

  if (types) {
    if (!types.endsWith('.d.ts')) {
      types = `${types.substr(0, types.lastIndexOf('.'))}.d.ts`
    }
  }

  if (!types) {
    types = 'index.d.ts'
  }

  if (!fileSys.existsSync(fileSys.join(fileSys.dirname(packageFile), types))) {
    return undefined
  }

  return types
}
