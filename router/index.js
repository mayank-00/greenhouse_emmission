const router = require('express').Router();

const config = require("configuration").getConfig()

router.use(config.BASE_PATH, require('./api'));

module.exports = router;