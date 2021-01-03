const redis = require('redis');
var client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL);
client.auth(process.env.REDIS_PASSWORD)

const connect = () => {
    client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL);
    client.auth(process.env.REDIS_PASSWORD)
}

// redis setup
client.on('connect', () => {
    console.log('[redis] redis connected.');
});

client.on('error', () => {
    console.log('[redis] redis disconnected.');
    setTimeout(connect, 5000);
});

module.exports = client;