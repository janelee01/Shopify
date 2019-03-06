const path = require('path');

module.exports = {
  'network.externalTesting': false,
  // 'network.externalTesting.address': '10.0.1.241',
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
      },{
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      }]
    }
  }
}
