import mongoose from "mongoose";

const chatRoomSchema = mongoose.Schema({

    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
},
    { timestamps: true })

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema)

export default ChatRoom