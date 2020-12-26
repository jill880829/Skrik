const UserData = require('./UserDataSchema');
const sha256 = require('crypto-js/sha256');
const base64 = require('crypto-js/enc-base64');

//TODO fool proof
async function findUser(username, password){
    try{
        user = await UserData.findOne({UserName: username});
    } catch(err) {
        console.error("[db] error querying user for login: " + err);
        return false;
    }

    if(user === null)
        return false;
    const passwordHash = base64.stringify(sha256(password));
    if (passwordHash === user.PassWord)
        return true;
    return false;
}


module.exports = {findUser: findUser};
