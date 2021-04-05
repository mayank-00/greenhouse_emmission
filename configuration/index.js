const path = require("path");
require("dotenv").config();

module.exports = {
    getConfig: () => {
        const envMap = {
            "development": "dev",
            "production": "prod"
        }
        return require(path.resolve(`./configuration/config.${envMap[process.env.NODE_ENV]}.json`));
    },
    memjsOptions: () => {
        if (process.env.NODE_ENV === "production") {
            return {
                username: process.env.MEMCACHIER_USERNAME,
                password: process.env.MEMCACHIER_PASSWORD
            }
        }

        return {}
    },
    swagger: () => {
        switch (process.env.NODE_ENV) {
            case "production":
                const prodConfig = require(path.resolve(`./configuration/config.prod.json`))
                return {
                    schemes: [prodConfig.SCHEME],
                    host: prodConfig.HOST,
                    basePath: prodConfig.BASE_PATH,
                }
            case "development":
                const devConfig = require(path.resolve(`./configuration/config.dev.json`))
                return {
                    schemes: [devConfig.SCHEME],
                    host: `${devConfig.HOST}:${process.env.PORT}`,
                    basePath: devConfig.BASE_PATH,
                }
            default:
                const localConfig = require(path.resolve(`./configuration/config.dev.json`))
                return {
                    schemes: [localConfig.SCHEME],
                    host: `${localConfig.HOST}:${process.env.PORT}`,
                    basePath: localConfig.BASE_PATH,
                }
        }
    }
}