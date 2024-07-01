import mongoose from "mongoose";

const userSkillSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId
    },
    skills : {
        type : Array
    }
})

const userSkills = mongoose.model("UserSkills",userSkillSchema)

export default userSkills