import fs from 'fs'
import { Mock } from 'ts-mockery'
import { fileSys } from '../src/fileSys'
import path from 'path'

const filePath = 'a/file/path'
const pathPart1 = 'pathPart1'
const pathPart2 = 'pathPart2'

describe('fileSys', () => {
  describe('readFileSync', () => {
    it('should pass supplied parameters to fs.readFileSync', () => {
      Mock.staticMethod(fs, 'readFileSync', jest.fn())

      fileSys.readFileSync(filePath, 'utf-8')

      expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf-8')
    })
  })

  describe('existsSync', () => {
    it('should pass supplied parameters to fs.existsSync', () => {
      Mock.staticMethod(fs, 'existsSync', jest.fn())

      fileSys.existsSync(filePath)

      expect(fs.existsSync).toHaveBeenCalledWith(filePath)
    })
  })

  describe('dirname', () => {
    it('should pass supplied parameters to path.dirname', () => {
      Mock.staticMethod(path, 'dirname', jest.fn())

      fileSys.dirname(filePath)

      expect(path.dirname).toHaveBeenCalledWith(filePath)
    })
  })

  describe('unlinkSync', () => {
    it('should pass supplied parameters to fs.unlinkSync', () => {
      Mock.staticMethod(fs, 'unlinkSync', jest.fn())

      fileSys.unlinkSync(filePath)

      expect(fs.unlinkSync).toHaveBeenCalledWith(filePath)
    })
  })

  describe('statSync', () => {
    it('should pass supplied parameters to fs.statSync', () => {
      Mock.staticMethod(fs, 'statSync', jest.fn())

      fileSys.statSync(filePath)

      expect(fs.statSync).toHaveBeenCalledWith(filePath)
    })
  })

  describe('readdirSync', () => {
    it('should pass supplied parameters to fs.readdirSync', () => {
      Mock.staticMethod(fs, 'readdirSync', jest.fn())

      fileSys.readdirSync(filePath)

      expect(fs.readdirSync).toHaveBeenCalledWith(filePath)
    })
  })

  describe('rmdirSync', () => {
    it('should pass supplied parameters to fs.rmdirSync', () => {
      Mock.staticMethod(fs, 'rmdirSync', jest.fn())

      fileSys.rmdirSync(filePath)

      expect(fs.rmdirSync).toHaveBeenCalledWith(filePath)
    })
  })

  describe('resolve', () => {
    it('should pass supplied parameters to path.resolve', () => {
      Mock.staticMethod(path, 'resolve', jest.fn())

      fileSys.resolve(pathPart1, pathPart2)

      expect(path.resolve).toHaveBeenCalledWith(pathPart1, pathPart2)
    })
  })

  describe('join', () => {
    it('should pass supplied parameters to path.join', () => {
      Mock.staticMethod(path, 'join', jest.fn())

      fileSys.join(pathPart1, pathPart2)

      expect(path.join).toHaveBeenCalledWith(pathPart1, pathPart2)
    })
  })
})
