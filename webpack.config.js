const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const config = {
    mode: "production",
    entry: path.join(__dirname, "src/assets/js/index.ts"),

    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /.s?css$/,
                use: ["css-loader"],
            },
        ],
    },
    
    output: {
        filename: "index.js",
        path: path.join(__dirname, "dist/assets/js")
    },

    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
    },

    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, "src/assets/css"),
                    to: path.join(__dirname, "dist/assets/css"),
                },
                {
                    from: path.join(__dirname, "src/assets/media"),
                    to: path.join(__dirname, "dist/assets/media"),
                },
                {
                    from: path.join(__dirname, "src/partials"),
                    to: path.join(__dirname, "dist/partials")
                },
                {
                    from: path.join(__dirname, "src/index.hbs"),
                    to: path.join(__dirname, "dist/index.hbs")
                },
                {
                    from: path.join(__dirname, "src/components"),
                    to: path.join(__dirname, "dist/components")
                },
                {
                    from: path.join(__dirname, "src/helpers.js"),
                    to: path.join(__dirname, "dist/helpers.js")
                }
            ],
        }),
    ],
};

module.exports = config;