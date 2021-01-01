import fs, { PathLike } from 'fs'
import path from 'path'

export const fileSys = {
  readFileSync: (path: string, encoding: BufferEncoding): string => fs.readFileSync(path, encoding),
  existsSync: (path: PathLike) => fs.existsSync(path),
  resolve: (...pathSegments: string[]): string => path.resolve(...pathSegments),
  join: (...paths: string[]) => path.join(...paths),
  dirname: (p: string) => path.dirname(p),
  unlinkSync: (path: PathLike) => fs.unlinkSync(path),
  statSync: (path: PathLike) => fs.statSync(path),
  readdirSync: (path: PathLike) => fs.readdirSync(path),
  rmdirSync: (path: PathLike) => fs.rmdirSync(path)
}
