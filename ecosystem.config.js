module.exports = {
    apps: [
        {
            // 指定解释器直接支持ts
            interpreter: "./node_modules/.bin/ts-node",
            // 解释器参数 -P 表示项目路径，会自动使用项目的 tsconfig.json
            // interpreter_args: "-P ./server -r tsconfig-paths/register",
            name: "app1",
            // 编译后运行
            // script: "./dist/src/app.js",
            script: "./src/app.ts",
            env_production: {
                NODE_ENV: "production",
            },
            env_development: {
                NODE_ENV: "development",
            },
            // wait_ready: true,
            // watch: ["src"],
            // watch: true,
            // watch_delay: 1000,
            ignore_watch: ["node_modules"],
        },
    ],
};
