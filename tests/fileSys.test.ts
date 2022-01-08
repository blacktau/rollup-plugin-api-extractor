import fs from 'fs'
import { fileSys } from '../src/fileSys'
import path from 'path'

const filePath = 'a/file/path'
const pathPart1 = 'pathPart1'
const pathPart2 = 'pathPart2'

jest.mock('fs')
jest.mock('path')

describe('fileSys', () => {
  describe('readFileSync', () => {
    it('should pass supplied parameters to fs.readFileSync', () => {
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => { return 'fakery' })

      fileSys.readFileSync(filePath, 'utf-8')

      expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf-8')
    })
  })

  describe('existsSync', () => {
    it('should pass supplied parameters to fs.existsSync', () => {
      fileSys.existsSync(filePath)

      expect(fs.existsSync).toHaveBeenCalledWith(filePath)
    })
  })

  describe('dirname', () => {
    it('should pass supplied parameters to path.dirname', () => {
      fileSys.dirname(filePath)

      expect(path.dirname).toHaveBeenCalledWith(filePath)
    })
  })

  describe('unlinkSync', () => {
    it('should pass supplied parameters to fs.unlinkSync', () => {
      fileSys.unlinkSync(filePath)

      expect(fs.unlinkSync).toHaveBeenCalledWith(filePath)
    })
  })

  describe('statSync', () => {
    it('should pass supplied parameters to fs.statSync', () => {
      fileSys.statSync(filePath)

      expect(fs.statSync).toHaveBeenCalledWith(filePath)
    })
  })

  describe('readdirSync', () => {
    it('should pass supplied parameters to fs.readdirSync', () => {
      fileSys.readdirSync(filePath)

      expect(fs.readdirSync).toHaveBeenCalledWith(filePath)
    })
  })

  describe('rmdirSync', () => {
    it('should pass supplied parameters to fs.rmdirSync', () => {
      fileSys.rmdirSync(filePath)

      expect(fs.rmdirSync).toHaveBeenCalledWith(filePath)
    })
  })

  describe('resolve', () => {
    it('should pass supplied parameters to path.resolve', () => {
      fileSys.resolve(pathPart1, pathPart2)

      expect(path.resolve).toHaveBeenCalledWith(pathPart1, pathPart2)
    })
  })

  describe('join', () => {
    it('should pass supplied parameters to path.join', () => {
      fileSys.join(pathPart1, pathPart2)

      expect(path.join).toHaveBeenCalledWith(pathPart1, pathPart2)
    })
  })
})
