import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    description: {
        type: String,
    },
    mediaItems: {
        type: Array,
    },
    likes: {
        count: {
            type: Number,
            default: 0,
        },
        users: [{
            type: mongoose.Schema.ObjectId,
            ref: 'users', // Assuming you have a 'User' model
        }],
    },
},
    {
        timestamps: true,
    });

const Post = mongoose.model('Post', postSchema);

export default Post;
