const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 地址 email 暱稱
const UserDataSchema = new Schema(
{
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    FacebookId: { type: String },
    GoogleId: { type: String },
    GithubId: { type: String },
    ProjectIds: [String] 
}, {collection: 'UserData'})

module.exports = mongoose.model('UserData', UserDataSchema)