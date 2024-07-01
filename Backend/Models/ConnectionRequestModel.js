import mongoose from "mongoose";

const connectionRequestSchema = mongoose.Schema({
    From : {
        type : mongoose.Types.ObjectId,
        required : true
    },
    To : {
        type : mongoose.Types.ObjectId,
        required : true
    }
})


const connectionRequests = mongoose.model('ConntectionRequests',connectionRequestSchema)

export default connectionRequests