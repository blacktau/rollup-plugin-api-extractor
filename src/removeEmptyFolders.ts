import { fileSys } from './fileSys'

export const removeEmptyFolders = (folder: string) => {
  const isDir = fileSys.statSync(folder).isDirectory()
  if (!isDir) {
    return
  }

  let files = fileSys.readdirSync(folder)
  if (files.length > 0) {
    files.forEach(function (file) {
      const fullPath = fileSys.join(folder, file)
      removeEmptyFolders(fullPath)
    })

    files = fileSys.readdirSync(folder)
  }

  if (files.length === 0) {
    fileSys.rmdirSync(folder)
  }
}
