import typescript from '@rollup/plugin-typescript'

/** @type {Array<import("rollup").RollupWatchOptions>} */
export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    exports: 'auto'
  },
  plugins: [
    typescript()
  ]
}