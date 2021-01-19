const mongoose = require('mongoose')
const Schema = mongoose.Schema


const LineChangeSchema = new Schema(
{
    Index: { type: Number, required: true },
    Type: { type: String, enum: ["insert", "update", "delete", "drop"], required: true },
    CreateTime: { type: String, required: true },
    UpdateTime: { type: String, required: true },
    DeleteTime: { type: String },
    Deleted: { type: Boolean, required: true },
    User: { type: String, required: true },
    Data: { type: String }
})

// no timestamp => timestamp is in linechange schema
const FileSchema = new Schema(
{
    FileName: { type: String, required: true },
    Deleted: {type: Boolean, required: true },
    LineChanges: [LineChangeSchema]
})

const ProjectSchema = new Schema(
{
    ProjectName: { type: String, required: true },
    Deleted: {type: Boolean, required: true },
    Users: [String],
    Files: [FileSchema]
}, {collection: 'Projects'})

module.exports = mongoose.model('Projects', ProjectSchema)