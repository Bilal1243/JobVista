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

const Followers = mongoose.model('Followers',followersSchema)

export default Followers