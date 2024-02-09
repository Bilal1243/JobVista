import mongoose from "mongoose";

const followersSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        required : true
    },
    followersList : {
        type : Array
    }
})

const Connections = mongoose.model('Connections',followersSchema)

export default Connections