const http = require("http");
require('module-alias/register')

const config = require("configuration").getConfig()

const db = require("./setup/database")
const memcached = require("./setup/memcached")
const app = require("./setup/expressApp")(db, memcached)

const server = http.createServer(app);
server.listen(process.env.PORT || 3005, () => {
    console.log("Server running on " + config.PORT);
});