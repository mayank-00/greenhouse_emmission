const app = require('express')()
const swagger = require('./swagger');

module.exports = function (db, memcached) {
    app.use(require('helmet')());
    app.use(require('cors')())

    app.set('db', db)
    app.set('memcached', memcached)

    app.use('/', swagger.router);

    app.use(require("router"))

    app.get('/', (req, res) => {
        res.redirect('/api/docs')
    })

    return app
}