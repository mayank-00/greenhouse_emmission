const Memcached = require('memcached');

const memcached = new Memcached()

memcached.connect('localhost:11211', function (err, conn) {
    if (err) {
        console.log(conn.server, 'error while memcached connection!!');
    }
});

memcached.asyncGet = (key) => {
    return new Promise((resolve, reject) => {
        memcached.get(key, (err, data) => {
            if (err || !data) {
                return reject(err)
            }
            resolve(data)
        })
    })
}

memcached.asyncGetMulti = (keys) => {
    return new Promise((resolve, reject) => {
        memcached.getMulti(keys, (err, data) => {
            if (err) {
                return reject(err)
            }
            resolve(data)
        })
    })
}

memcached.asyncSet = (key, value, time = 3600) => {
    return new Promise((resolve, reject) => {
        memcached.set(key, value, time, (err, data) => {
            if (err) {
                return reject(err)
            }
            resolve(data)
        })
    })
}

module.exports = memcached