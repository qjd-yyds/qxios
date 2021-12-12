import json from 'rollup-plugin-json';
// rollup.config.js
export default {
  input: 'src/main.js',
  output: {
    format: 'cjs',
    file: 'bundle.js'
  },
  plugins: [json()]
};
