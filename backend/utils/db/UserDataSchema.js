const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserDataSchema = new Schema(
{
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    FacebookId: { type: String },
    GoogleId: { type: String },
    GithubId: { type: String },
    ProjectIds: [String],
    Nickname: { type: String },
    Company: { type: String },
    Githubname: { type: String },
    Facebookname: { type: String },
    Location: { type: String },
    Email: { type: String }
}, {collection: 'UserData'})

module.exports = mongoose.model('UserData', UserDataSchema)