function get(key, param = "") {

    return function (req, res, next) {

        let memcached = req.app.get('memcached')

        let cacheKey = key

        if (param !== "") {
            cacheKey = `${key}-${req.params[param]}`
        }

        memcached.asyncGet(cacheKey)
            .then(data => {
                return res.status(200).json({ key: data })
            })
            .catch(() => {
                return next()
            })

    }
}

function set(key, value) {
    return function (req, res, next) {

    }
}

module.exports = {
    get, set
}