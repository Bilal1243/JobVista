import mongoose from "mongoose";


const questionSchema = mongoose.Schema({

    jobId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    questions: {
        type: Array
    }

},
    {
        timestamps: true
    })


const JobQuestions = mongoose.model('JobQuestions',questionSchema)

export default JobQuestions