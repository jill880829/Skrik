const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserDataSchema = new Schema(
{
    UserName: { type: String, required: true },
    PassWord: { type: String, required: true },
    FacebookId: { type: String },
    GoogleId: { type: String },
    GithubId: { type: String },
    ProjectIds: [String] 
}, {collection: 'UserData'})

module.exports = mongoose.model('UserData', UserDataSchema)