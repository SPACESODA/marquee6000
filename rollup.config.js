const typescript = require('@rollup/plugin-typescript');

module.exports = {
  input: 'src/marquee6k.ts',
  output: [
    {
      file: 'marquee6k.js',
      format: 'umd',
      name: 'marquee6k',
      exports: 'default',
      sourcemap: true
    },
    {
      file: 'marquee6k.esm.js',
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [typescript()]
};
