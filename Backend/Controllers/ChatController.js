import asyncHandler from "express-async-handler";
import ChatRoom from '../Models/chatRoomModel.js';
import Message from '../Models/messagesModel.js';
import Users from "../Models/userModel.js";

const createRoom = asyncHandler(async (req, res) => {
    console.log("here");
    const { userId, receiverId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await ChatRoom.find({
        $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: receiverId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await Users.populate(isChat, {
        path: "latestMessage.sender",
        select: "firsName lastName email profileImg",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            users: [userId, receiverId],
        };

        try {
            const createdChat = await ChatRoom.create(chatData);
            const FullChat = await ChatRoom.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const chatSend = asyncHandler(async (req, res) => {
    const { sender, content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: sender,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await Message.findById(message._id).populate("sender", "firstName lastName profileImg").populate("chat").exec();

        // Assuming Users is the model for your users
        message = await Users.populate(message, {
            path: "chat.users",
            select: "firstName lastName profileImg email",
        });

        let chatRoom = await ChatRoom.findById(req.body.chatId);
        chatRoom.latestMessage = message;
        await chatRoom.save();

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

});


const getRooms = asyncHandler(async (req, res) => {
    const userId = req.query.userId
    try {
        ChatRoom.find({ users: { $elemMatch: { $eq: userId } } })
            .populate("users", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await Users.populate(results, {
                    path: "latestMessage.sender",
                    select: "firstName lastName profileImg email",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


const getMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.body

    try {
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "firstName lastName profileImg")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

export { createRoom, chatSend, getRooms, getMessages };