const path = require('path');

module.exports = {
  'network.externalTesting': false,
  'webpack.extend': {
    'module': {
      'rules': [{
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, "src/scripts/sections")
        ],
        loader: "eslint-loader"
      }]
    }
  }
}
