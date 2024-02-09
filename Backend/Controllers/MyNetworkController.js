import Users from '../Models/userModel.js'
import industries from '../Models/industriesModel.js'
import JobPreference from '../Models/JobPreferenceModel.js'
import Connections from '../Models/connestionsModel.js'


import asyncHandler from 'express-async-handler'
import { ObjectId } from 'mongodb'


const listUsers = asyncHandler(async (req, res) => {
    const userId = req.query.userId;
    const userJobPreference = await JobPreference.findOne({ userId: userId });
    const findUser = await Users.findOne({ _id: userId });

    const userFollowers = await Connections.findOne({ userId: findUser._id });

    // Fetch the list of followed users by the requesting user
    const followersList = userFollowers ? userFollowers.followersList : [];

    // Find users with the same industryType as the requesting user but not followed by the user
    const result = await Users.find({
        industryType: findUser.industryType,
        _id: { $nin: [...followersList, findUser._id] } // Filter out users followed by the user and the user itself
    });

    if (result.length > 0) {
        res.json(result);
    } else {
        // If no users found with the same industryType and not followed, return all users
        const allUsers = await Users.find();
        res.json(allUsers);
    }
});

const connectUser = asyncHandler(async (req, res) => {
    const connectId = req.query.connectId;
    const userId = req.query.userId;

    console.log(connectId)

    // Check if a connection already exists for the userId
    let existingConnection = await Connections.findOne({ userId: userId });

    if (existingConnection) {
        // If the connection already exists, add connectId to followersList
        existingConnection.followersList.push(connectId);
        await existingConnection.save();
        res.status(200).json({ success: true });
    } else {
        // If the connection does not exist, create a new one
        const newConnection = new Connections({
            userId: userId,
            followersList: [new ObjectId(connectId)] // Initialize followersList with connectId
        });
        await newConnection.save();
        res.status(201).json({ success: true });
    }
});




export {
    listUsers,
    connectUser
}