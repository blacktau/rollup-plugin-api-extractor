import * as fs from 'fs'
import * as path from 'path'

export const removeEmptyFolders = (folder: string) => {
  const isDir = fs.statSync(folder).isDirectory()
  if (!isDir) {
    return
  }

  let files = fs.readdirSync(folder)
  if (files.length > 0) {
    files.forEach(function (file) {
      const fullPath = path.join(folder, file)
      removeEmptyFolders(fullPath)
    })

    files = fs.readdirSync(folder)
  }

  if (files.length === 0) {
    fs.rmdirSync(folder)
  }
}
