const memjs = require('memjs');

const options = require("configuration").memjsOptions()

var memcached = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
    failover: true,
    timeout: 1,
    keepAlive: true,
    ...options
})

memcached.flush(function (err) {
    if (err) {
        console.error('memcached', 'flush', err);
    } else {
        console.log('memcached', 'flush', 'successful');
    }
});

memcached.asyncGet = (key) => {
    return new Promise((resolve, reject) => {
        memcached.get(key, (err, buffer) => {
            if (err != null) {
                return reject(err)
            }
            if (buffer != null) {
                let data = JSON.parse(buffer.toString())
                return resolve(data)
            }
            reject("value is null")
        })
    })
}

memcached.asyncSet = (key, value, options = { expires: 3600 }) => {
    return new Promise((resolve, reject) => {

        let stringValue = JSON.stringify(value)
        memcached.set(key, stringValue, options, (err, data) => {
            if (err != null) {
                return reject(err)
            }
            resolve(data)
        })
    })
}

module.exports = memcached