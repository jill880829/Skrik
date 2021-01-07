const client = require("../redis")
const Bluebird = require('bluebird');

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

async function getUser(hash){
    var clientPromise = new Bluebird( (resolve, reject) => client.get(hash, (d, r) => {resolve(r)}));
    var keyData = await clientPromise;  
    if (keyData === null || keyData === undefined)
        return { "success": false, "description": "id Not exisited!!!", "id":  null};    
    var username = keyData.split('/')[0];
    return { "success": true, "description": "Finish Getting from REDIS ", "username":  username};
    
}

/* authenticate shaID*/
async function authID(idsha){
    var user_res = await getUser(idsha);
    if (user_res["success"] === false) 
        throw 'Project Hash Not Found!!!';
    var id_res = await getID(idsha);
    if (id_res["success"] === false) 
        throw 'Project Hash Not Found!!!';        
    return {Username: user_res["username"], Projectid: id_res["id"]};
}

module.exports = {storeID: storeID,
                  getID: getID,
                  authID: authID
                };