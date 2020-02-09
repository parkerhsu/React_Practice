const redis = require("redis");
const { REDIS_CONF }  = require("../config/db");

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on('error', err => {
    console.error(err);
});

function set(key, value) {
    if (typeof value === 'object') {
        value = JSON.stringify(value);
    }
    redisClient.set(key, value);
}

function get(key, value) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, value) => {
            if (err) {
                reject(err);
                return;
            }
            if (value === null) {
                resolve(null);
                return;
            }
            
            try {
                resolve(JSON.parse(value));
            } catch(ex) {
                reject(ex);
            }
        });
    });
}

module.exports = {
    set,
    get
}