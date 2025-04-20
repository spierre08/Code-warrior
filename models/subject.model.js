import mongoose from "mongoose"

const { Schema } = mongoose
const SubjectSchema = new Schema({
    name: String
}, {
    timestamps: true,
    collection: "subjects"
})

const SubjectModel = mongoose.model("Subject", SubjectSchema)

export default SubjectModel