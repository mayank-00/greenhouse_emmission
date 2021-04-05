const path = require("path");
require("dotenv").config();

module.exports = {
    getConfig: () => {
        return require(path.resolve(`./configuration/config.${process.env.NODE_ENV}.json`));
    }
}