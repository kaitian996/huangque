import typescript from '@rollup/plugin-typescript'
import { resolve } from 'path'
const fileName = 'huangque'
const moduleName = 'HuangQue'
const basePath = process.cwd()
export default {
  input: resolve(basePath, 'src/index.ts'),
  output: [
    {
      file: resolve(basePath, `dist/${fileName}.esm-bundler.js`),
      format: 'es',
      name: moduleName,
    },
    {
      file: resolve(`dist/${fileName}.esm-browser.js`),
      format: 'es',
      name: moduleName,
    },
    {
      file: resolve(`dist/${fileName}.cjs.js`),
      format: 'cjs',
      name: moduleName,
    },
    {
      file: resolve(`dist/${fileName}.global.js`),
      format: 'iife',
      name: moduleName,
    },
  ],
  plugins: [
    typescript({
      tsconfig: resolve(basePath, 'tsconfig.json'),
    }),
  ],
}
