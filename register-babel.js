require("babel-register")({
  ignore: /node_modules/,
  plugins: [
    'transform-es2015-template-literals',
    'transform-es2015-modules-commonjs',
    'transform-async-to-generator',
  ],
});
