import mongoose from "mongoose";

const experienceSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    experiences: [
        {
            company: {
                type: String,
                required: true
            },
            role: {
                type: String,
                required: true
            },
            period: {
                type: Number,
                required: true
            }
        }
    ]
})


const Experiences = mongoose.model('experiences', experienceSchema)

export default Experiences