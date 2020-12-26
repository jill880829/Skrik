const UserData = require('./UserDataSchema');
const sha256 = require('crypto-js/sha256');
const base64 = require('crypto-js/enc-base64');
const regxstr = /^[ A-Za-z0-9_.-]+$/;


async function createUser(username, password){
    if (username.match(regxstr) === null)
        return { "success": false, "description": "Invalid Username!!!" };
    if (password.match(regxstr) === null)
        return { "success": false, "description": "Invalid Password!!!" };
    
    try{
        var user = await UserData.findOne({Username: username});
    } catch(err) {
        console.error("[db] error querying user for register: " + err);
        return { "success": false, "description": "Querying user Failed!!!" };
    }
    
    if(user !== null)
        return { "success": false, "description": "Username Existed" };
    const passwordHash = base64.stringify(sha256(password));
    try{  
        await UserData.create({ Username: username, Password: passwordHash });
    } catch (err) {
        console.error("[db] error creating user in UserDatas database: " + err);
        return { "success": false, "description": "User creation Failed!!!" };
    }

    return { "success": true, "description": "User creation Finished!!!" };
}

async function authUser(username, password){
    if (username.match(regxstr) === null)
        return { "success": false, "description": "Invalid Username!!!" };
    if (password.match(regxstr) === null)
        return { "success": false, "description": "Invalid Password!!!" };
    
    try{
        var user = await UserData.findOne({Username: username});
    } catch(err) {
        console.error("[db] error querying user for login: " + err);
        return { "success": false, "description": "Querying user Failed!!!" };
    }

    if(user === null)
        return { "success": false, "description": "Authentication Failed!!!" };
    const passwordHash = base64.stringify(sha256(password));
    if (passwordHash === user.Password)
        return { "success": true, "description": "Authentication Finished!!!" };
    return { "success": false, "description": "Authentication Failed!!!" };
}

//TEST
// list project ids in user profile page
async function listProjectids(username){
    if (username.match(regxstr) === null)
        return { "success": false, "description": "Invalid Username!!!", "ids": null };

    try{
        var userdata = await UserData.find({Username: username});
    } catch (err) {
        console.error("[db] error querying user in User collection: " + err);
        return { "success": false, "description": "Querying user Failed!!!", "ids": null };
    }   

    return { "success": true, "description": "List Project ids", "ids": userdata.ProjectIds };
}


module.exports = {authUser: authUser,
                  listProjectids:listProjectids,
                  createUser:createUser};
