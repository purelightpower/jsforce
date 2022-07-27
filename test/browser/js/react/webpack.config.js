const path = require("path");
const Dotenv = require("dotenv-webpack");

const babelConfigFile = path.resolve(__dirname, "babel.config.json");

module.exports = {
    entry: path.resolve(__dirname, "dev/index.jsx"),
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                    configFile: babelConfigFile,
                },
            },
            {
                test: /\.jsx$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                    configFile: babelConfigFile,
                },
            },
        ],
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"],
        fallback: {
            stream: require.resolve("stream-browserify"),
            timers: require.resolve("timers-browserify"),
        },
    },
    output: {
        path: path.resolve(__dirname, "prod/"),
        filename: "bundle.js",
    },
    plugins: [new Dotenv()],
    devtool: "source-map",
};
