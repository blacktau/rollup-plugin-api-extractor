import { Mock } from 'ts-mockery'
import { getTypings } from '../src/getTypings'
import { fileSys } from '../src/fileSys'

describe('getTypings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('should read the types from package.json', () => {
    Mock.staticMethod(fileSys, 'resolve', () => 'path/to/package.json')
    Mock.staticMethod(fileSys, 'readFileSync', () => '{"types": "dist/test-package.d.ts"}')
    Mock.staticMethod(fileSys, 'existsSync', () => true)

    const typings = getTypings()

    expect(typings).toBe('dist/test-package.d.ts')
  })

  it('should try for type def named after main if types and typings not defined', () => {
    Mock.staticMethod(fileSys, 'resolve', () => 'path/to/package.json')
    Mock.staticMethod(fileSys, 'readFileSync', () => '{"main": "dist/typedef-test.js"}')
    Mock.staticMethod(fileSys, 'existsSync', () => true)

    const typings = getTypings()

    expect(typings).toBe('dist/typedef-test.d.ts')
  })

  it('should fallback to index.d.ts if package.json missing types, typings, and main', () => {
    Mock.staticMethod(fileSys, 'resolve', () => 'path/to/package.json')
    Mock.staticMethod(fileSys, 'readFileSync', () => '{}')
    Mock.staticMethod(fileSys, 'existsSync', () => true)

    const typings = getTypings()

    expect(typings).toBe('index.d.ts')
  })

  it('should replace a non .d.ts file extension with a .d.ts', () => {
    Mock.staticMethod(fileSys, 'resolve', () => 'path/to/package.json')
    Mock.staticMethod(fileSys, 'readFileSync', () => '{"types": "dist/test-package-types.js"}')
    Mock.staticMethod(fileSys, 'existsSync', () => true)

    const typings = getTypings()

    expect(typings).toBe('dist/test-package-types.d.ts')
  })

  it('should return undefined if type file does not exist ', () => {
    Mock.staticMethod(fileSys, 'resolve', () => 'path/to/package.json')
    Mock.staticMethod(fileSys, 'readFileSync', () => '{"types": "dist/test-package-types.js"}')
    Mock.staticMethod(fileSys, 'existsSync', () => false)

    const typings = getTypings()

    expect(typings).toBeUndefined()
  })
})
