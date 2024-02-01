import mongoose from "mongoose";

const skillsSchema = mongoose.Schema({
    skill : {
        type : String
    },
    isListed : {
        type : Boolean,
        default : true
    }
})

const Skills = mongoose.model("Skills",skillsSchema)

export default Skills