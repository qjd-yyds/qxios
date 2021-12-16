import json from 'rollup-plugin-json'; // 支持json
import nodeResolve from 'rollup-plugin-node-resolve'; // 识别node_modules包
import commonjs from 'rollup-plugin-commonjs'; // 将非ES6语法的包转为ES6可用
import { terser } from 'rollup-plugin-terser'; // 压缩js
import ts from 'rollup-plugin-typescript2';
const format = ['umd', 'cjs', 'esm', 'amd'];
function createProductionConfig(format) {
  return {
    name: 'axios',
    file: `dist/axios.${format}.js`,
    format, // 输出umd格式，各种模块规范通用
    sourcemap: true //生成bundle.map.js文件，方便调试
  };
}
const config = {
  input: 'lib/axios.ts',
  output: format.map((item) => createProductionConfig(item)),
  plugins: [nodeResolve(), commonjs(), json(), ts()]
};
export default config;
