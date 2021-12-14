import json from 'rollup-plugin-json';
// rollup.config.js
export default {
  input: 'lib/axios.js',
  output: {
    format: 'umd',
    file: 'dist/bundle.js',
    name: 'axios'
  },
  plugins: [json()]
};
