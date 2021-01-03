const redis = require('redis');
const client = redis.createClient();
// const client = redis.createClient(6379,'127.0.0.1');
// client.auth('password')
// redis setup
client.on('connect', () => {
    console.log('Redis client connected');
  });

function storeID(hash, username, id){
    try {
        client.set(hash, username + '-' + id)
    } catch (err){
        return { "success": false, "description": "Querying REDIS Failed" };
    }
    return { "success": true, "description": "Finish Storing to REDIS " };
}

function getID(hash){
    console.log()
    try {
        var _res = client.get(hash);
    } catch (err){
        return { "success": false, "description": "Querying REDIS Failed" };
    }
    console.log(typeof(_res))
    var projectid = _res.split('-')[1];
    return { "success": true, "description": "Finish Getting from REDIS ", "id":  projectid};
}

module.exports = {storeID: storeID,
                  getID: getID
                };