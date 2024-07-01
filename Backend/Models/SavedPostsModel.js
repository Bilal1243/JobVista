import mongoose from "mongoose";

const savedPostschema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    savedItems: {
        type: Array
    }
}, {
    timestamps: true,
});

const SavedPosts = mongoose.model('SavedPosts', savedPostschema);

export default SavedPosts;
