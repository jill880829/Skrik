const mongoose = require('mongoose')
const Schema = mongoose.Schema


const LineChange = new Schema(
{
    Index: { type: Number, required: true },
    Type: { type: String, enum: ["insert", "delete"], required: true },
    CreateTime: { type: String, required: true },
    UpdateTime: { type: String, required: true },
    DeleteTime: { type: String },
    Deleted: { type: Boolean, required: true },
    Data: { type: String }
})


const File = new Schema(
{
    FileName: { type: String, required: true },
    Deleted: {type: Boolean, required: true },
    LineChanges: [LineChange]
})

const Project = new Schema(
{
    ProjectName: { type: String, required: true },
    ProjectId: { type: String, required: true },
    Users: [String],
    Files: [File]  
})

module.exports = mongoose.model('Project', Project)