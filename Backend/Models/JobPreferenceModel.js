import mongoose, { mongo } from "mongoose";

const jobPreferenceSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId
    },
    jobTitle : {
        type : String
    },
    jobType : {
        type : String
    },
    minPay : {
        type : Number
    }
})

const JobPreference = mongoose.model('JobPreferences',jobPreferenceSchema)

export default JobPreference