import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
