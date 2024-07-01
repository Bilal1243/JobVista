import mongoose from "mongoose";

const applicationSchema = mongoose.Schema({
    jobId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    experience:
    {
        company: {
            type: String
        },
        jobTitle: {
            type: String
        }
    },
    questionReply : {
        type : Array,
        default : null
    },
    applicationStatus : {
        type : String,
        default : 'Applied'
    },
    resume: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    })

const jobApplications = mongoose.model('jobApplications', applicationSchema)

export default jobApplications