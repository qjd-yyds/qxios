import json from 'rollup-plugin-json';
import example from './plugins/example.js';
// rollup.config.js
export default {
  // input: 'src/main.js',
  input: 'virtual-module',
  output: {
    format: 'cjs',
    file: 'bundle.js'
  },
  plugins: [json(), example()]
};
