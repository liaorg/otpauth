// https://alloyteam.github.io/eslint-config-alloy/
module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    overrides: [
        {
            files: ["**/*.ts", "**/*.tsx"],
            extends: ["alloy", "alloy/typescript"],
        },
        {
            files: ["**/*.js"],
            parser: "babel-eslint",
            // parser: "@babel/eslint-parser",
            // plugins: ["@babel"],
            // parserOptions: {
            //     requireConfigFile: false,
            // },
        },
    ],
    env: {
        // 你的环境变量（包含多个预定义的全局变量）
        //
        // browser: true,
        node: true,
        // mocha: true,
        jest: true,
        // jquery: true
    },
    globals: {
        // 你的全局变量（设置为 false 表示它不允许被重新赋值）
        //
        // myGlobal: false
    },
    rules: {
        // 自定义你的规则
    },
};
