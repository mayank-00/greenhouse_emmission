const path = require("path");
require("dotenv").config();

module.exports = {
    getConfig: () => {
        const envMap = {
            "development": "dev",
            "production": "prod"
        }
        return require(path.resolve(`./configuration/config.${envMap[process.env.NODE_ENV]}.json`));
    }
}