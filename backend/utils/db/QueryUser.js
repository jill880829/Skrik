const UserData = require('./UserDataSchema');
const sha256 = require('crypto-js/sha256');
const base64 = require('crypto-js/enc-base64');
const crypto = require('crypto'); 
// const { use } = require('../../routes/ApiRouter');
const regxstr = /^[ A-Za-z0-9_.-]+$/;
const regxnum = /^[0-9]+$/;
const regxemail = /^[ @A-Za-z0-9_.-]+$/;

// TODO: addUser function

// register use
async function createUser(username, password){
    if (typeof(username) !== "string" || username.match(regxstr) === null)
        return { "success": false, "description": "Invalid Username!!!" };
    if (typeof(password) !== "string" || password.match(regxstr) === null)
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

// login authentication
async function authUser(username, password){
    if (typeof(username) !== "string" || username.match(regxstr) === null)
        return { "success": false, "description": "Invalid Username!!!" };
    if (typeof(password) !== "string" || password.match(regxstr) === null)
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

// list project ids in user profile page
async function listProjectids(username){
    if (typeof(username) !== "string" || username.match(regxstr) === null)
        return { "success": false, "description": "Invalid Username!!!", "ids": null };

    try{
        var userdata = await UserData.findOne({Username: username});
    } catch (err) {
        console.error("[db] error querying user in User collection: " + err);
        return { "success": false, "description": "Querying user Failed!!!", "ids": null };
    }
    if (userdata === null)
        return { "success": false, "description": "Username not exsisted", "ids": null };
    return { "success": true, "description": "List Project ids", "ids": userdata.ProjectIds };
}

async function createFBUser(fbid, _user){
    if (typeof(fbid) !== "string" || fbid.match(regxnum) === null)
        return { "success": false, "description": "Invalid fbid!!!" };
    try{
        var user = await UserData.findOne({FacebookId: fbid});
    } catch(err) {
        console.error("[db] error querying user: " + err);
        return { "success": false, "description": "Querying user Failed!!!" };
    }

    if(user !== null)
        return { "success": fasle, "description": "User Already Existed" };

    var buf = crypto.randomBytes(15);
    var passwd = buf.toString('hex');
    var username = sha256(_user).toString();        
    try{  
        await UserData.create({ Username: username, Password: passwd, FacebookId: fbid });
    } catch (err) {
        console.error("[db] error creating user in UserDatas database: " + err);
        return { "success": false, "description": "User creation Failed!!!" };
    }
    return { "success": true, "description": "User creation Finished!!!" };
}

async function setProfile(username, nickname, company, gitname, fbname, loc, email){
    if (typeof(username) !== "string" || username.match(regxstr) === null)
        return { "success": false, "description": "Invalid Username!!!" };
    if (typeof(nickname) !== "string")
        return { "success": false, "description": "Invalid Username!!!" };
    if (typeof(company) !== "string")
        return { "success": false, "description": "Invalid Password!!!" };
    if (typeof(gitname) !== "string")
        return { "success": false, "description": "Invalid Git Name!!!" };
    if (typeof(fbname) !== "string")
        return { "success": false, "description": "Invalid FB Name!!!" };
    if (typeof(loc) !== "string")
        return { "success": false, "description": "Invalid Location!!!" };
    if (typeof(email) !== "string")
        return { "success": false, "description": "Invalid Email!!!" };
    
    try{
        var user = await UserData.findOne({Username: username});
    } catch(err) {
        console.error("[db] error querying user: " + err);
        return { "success": false, "description": "Querying user Failed!!!" };
    }
    if(user === null)
        return { "success": false, "description": "User not Exisited" };
    user.Nickname = nickname;
    user.Company = company;
    user.Githubname = gitname;
    user.Facebookname = fbname;
    user.Location = loc;
    user.Email = email;
    try{
        await user.save();
    } catch (err){
        console.error("[db] error saving user: " + err);
        return { "success": false, "description": "Operation Failed!!!" };
    }

    return { "success": true, "description": "Operation Success!!!" };
}

async function getProfile(username){

    if (typeof(username) !== "string" || username.match(regxstr) === null)
        return { "success": false, "description": "Invalid Username!!!" };
    try{
        var user = await UserData.findOne({Username: username});
    } catch(err) {
        console.error("[db] error querying user: " + err);
        return { "success": false, "description": "Querying user Failed!!!" };
    }

    if(user === null)
        return { "success": fasle, "description": "User Not Existed" };

    const data = {"Nickname": user.Nickname,
                  "Company": user.Company,
                  "Githubname": user.Githubname,
                  "Facebookname": user.Facebookname,
                  "Location": user.Location,
                  "Email": user.Email};
    return { "success": true, "description": "Getting Profile Finished!!!", "Data": data };
}
module.exports = {authUser: authUser,
                  listProjectids:listProjectids,
                  createUser:createUser,
                  createFBUser:createFBUser,
                  setProfile:setProfile,
                  getProfile:getProfile};
