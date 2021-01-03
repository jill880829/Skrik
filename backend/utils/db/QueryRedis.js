const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL);
const Bluebird = require('bluebird');
// const client = redis.createClient(6379,'127.0.0.1');
// client.auth('password')
// redis setup


client.on('connect', () => {
    console.log('Redis client connected');
  });

function storeID(hash, username, id){
    try {
        client.set(hash, username + '/' + id,'EX', 60 * 5)
    } catch (err){
        return { "success": false, "description": "Querying REDIS Failed" };
    }
    return { "success": true, "description": "Finish Storing to REDIS " };
}

async function getID(hash){
    var clientPromise = new Bluebird( (resolve, reject) => client.get(hash, (d, r) => {resolve(r)}));
    var keyData = await clientPromise;  
    if (keyData === null || keyData === undefined)
        return { "success": false, "description": "id Not exisited!!!", "id":  null};    
    var projectid = keyData.split('/')[1];
    return { "success": true, "description": "Finish Getting from REDIS ", "id":  projectid};
    
}

module.exports = {storeID: storeID,
                  getID: getID
                };