import apiExtractor from '../src/index'
import { OutputOptions, rollup } from 'rollup'
import path, { join } from 'path'
import fs from 'fs'

const cwd = join(__dirname, 'fixtures/');
const file = join(cwd, 'output/bundle.js')
const outputOptions: OutputOptions = { file, format: 'cjs' }

it('should return a plugin named api-extractor', () => {
  const plugin = apiExtractor()
  expect(plugin.name).toBe('api-extractor')
})  

it('should expose a writeBundle function', () => {
  const plugin = apiExtractor()
  expect(plugin.writeBundle).toBeInstanceOf(Function)
})  

it('should run when given minimal configuration', async () => {
  const pwd = process.cwd()
    
  process.chdir(path.resolve(__dirname, 'fixtures/minimalConfig/'))
  const bundle = await rollup({
    input: 'src/index.ts',
    plugins: [
      apiExtractor({
        configuration: {
          projectFolder: '.',
          compiler: {
            tsconfigFilePath: '<projectFolder>/tsconfig.json'
          }
        }
      })
    ]
  })

  await bundle.write(outputOptions)
  process.chdir(pwd)

  const expected = fs.readFileSync(path.resolve(__dirname, 'fixtures/minimalConfig/', 'expected.d.ts')).toString()
  const result = fs.readFileSync(path.resolve(__dirname, 'fixtures/minimalConfig/dist', 'index.d.ts')).toString()
  expect(result).toEqual(expected)
})
