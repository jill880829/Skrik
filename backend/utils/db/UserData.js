const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserData = new Schema(
{
    UserName: { type: String, required: true },
    PassWord: { type: String, required: true },
    FacebookId: { type: String },
    GoogleId: { type: String },
    GithubId: { type: String },
    ProjectIds: [String] 
})

module.exports = mongoose.model('UserData', UserData)