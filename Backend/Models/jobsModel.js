import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
    recruiterId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    jobRole: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    industryType: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    jobType: {
        type: Array,
        required: true
    },
    openings: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    salaryRange: {
        minimum: {
            type: Number
        },
        maximum: {
            type: Number
        }
    },
    rate: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    experience: {
        minimum: {
            type: Number
        },
        maximum: {
            type: Number
        }
    },
    skills: {
        type: Array
    },
    location: {
        type: String
    },
    deadline: {
        type: Date,
        default: null
    },
    recruited: {
        type: Boolean,
        default: false
    },
    email: {
        type: String
    },
    mobile: {
        type: Number
    },
    applicationCount: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    }
)

const Jobs = mongoose.model('Jobs', jobSchema)

export default Jobs