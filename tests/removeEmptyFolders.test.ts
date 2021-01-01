import { PathLike, Stats } from 'fs'
import path from 'path'
import { Mock } from 'ts-mockery'
import { fileSys } from '../src/fileSys'
import { removeEmptyFolders } from '../src/removeEmptyFolders'

const folderPath = 'a/folder/path'
const filePath = 'a/file/path.txt'
const fileName = 'path.txt'

describe('removeEmptyFolders', () => {
  it('should ignore files', () => {
    Mock.staticMethod(fileSys, 'statSync', () => Mock.of<Stats>({ isDirectory: () => false }))
    Mock.staticMethod(fileSys, 'readdirSync', () => [])

    removeEmptyFolders(filePath)

    expect(fileSys.readdirSync).not.toHaveBeenCalled()
  })

  it('should remove the folder if its empty', () => {
    Mock.staticMethod(fileSys, 'statSync', () => Mock.of<Stats>({ isDirectory: () => true }))
    Mock.staticMethod(fileSys, 'readdirSync', () => [])
    Mock.staticMethod(fileSys, 'rmdirSync', jest.fn())

    removeEmptyFolders(folderPath)

    expect(fileSys.readdirSync).toHaveBeenCalled()
    expect(fileSys.rmdirSync).toHaveBeenCalledWith(folderPath)
  })

  it('should check all the contents of the folder', () => {
    Mock.staticMethod(fileSys, 'statSync',
      (path: PathLike) => {
        switch (path) {
          case folderPath: return Mock.of<Stats>({ isDirectory: () => true })
          default: return Mock.of<Stats>({ isDirectory: () => false })
        }
      }
    )

    Mock.staticMethod(fileSys, 'readdirSync', () => [fileName, fileName + '2'])

    removeEmptyFolders(folderPath)

    expect(fileSys.statSync).toHaveBeenCalledWith(path.join(folderPath, fileName))
    expect(fileSys.statSync).toHaveBeenCalledWith(path.join(folderPath, fileName + '2'))
  })
})
