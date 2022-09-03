import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'build/es2020/core.js',
  output: {
    file: 'dist/fesm2020.js',
    format: 'es',
  },
  external: (id) => {
    // inline @ionic/core deps
    if (id === '@ionic/core') {
      return false;
    }
    // anything else is external
    // Windows: C:\xxxxxx\xxx
    const colonPosition = 1;
    return !(id.startsWith('.') || id.startsWith('/') || id.charAt(colonPosition) === ':');
  },
  plugins: [
    resolve({
      module: true,
    }),
  ],
};
