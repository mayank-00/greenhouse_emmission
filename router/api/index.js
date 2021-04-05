const router = require('express').Router();

router.use('/countries', require('./countries'));

router.use('/categories', require('./categories'));

router.use('/emmissionRecords', require('./emmissionRecords'));

module.exports = router;