const path = require("path");

module.exports = {
  mode: "production",
  entry: ["./src/index.js"],
  output: {
    path: path.join(__dirname, "/dist/"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        exclude: "/node_modules/",
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },
};
