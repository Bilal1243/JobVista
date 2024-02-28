import Users from '../Models/userModel.js'
import industries from '../Models/industriesModel.js'
import JobPreference from '../Models/JobPreferenceModel.js'
import Connections from '../Models/connestionsModel.js'
import connectionRequests from '../Models/ConnectionRequestModel.js'
import Post from '../Models/postsModel.js'
import Comment from '../Models/commentsModel.js'
import SavedPosts from '../Models/SavedPostsModel.js'


import asyncHandler from 'express-async-handler'
import { ObjectId } from 'mongodb'
import Skills from '../Models/skillsModel.js'
import userSkills from '../Models/userSkillsModel.js'


const listUsers = asyncHandler(async (req, res) => {
    const userId = req.query.userId;
    const userJobPreference = await JobPreference.findOne({ userId: userId });
    const findUser = await Users.findOne({ _id: userId });

    const userFollowers = await Connections.findOne({ userId: findUser._id });
    // Extract IDs of users from userRequests
    const requestedUsers = await connectionRequests.find({ From: userId });
    const requestedIds = requestedUsers.map(request => request.To);

    // Extract IDs of users from userRequests
    const userRequests = await connectionRequests.find({ To: userId });
    const requestedUserIds = userRequests.map(request => request.From);

    // Fetch the list of followed users by the requesting user
    const followersList = userFollowers ? userFollowers.followersList : [];

    // Find users with the same industryType as the requesting user but not followed by the user and not in userRequests
    let result = await Users.find({
        industryType: findUser.industryType,
        _id: {
            $nin: [...followersList, findUser._id, ...requestedUserIds, ...requestedIds] // Filter out users followed by the user, the user itself, and users who have sent requests to the user
        }
    });

    const requests = await connectionRequests.aggregate([
        {
            $match: { To: new ObjectId(userId) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'From',
                foreignField: '_id',
                as: 'user'
            }
        }
    ])

    if (result.length > 0) {
        res.json({ requests, result });
    } else {
        // If no users found with the same industryType and not followed, return all users
        let result = await Users.find({
            _id: {
                $nin: [...followersList, findUser._id, ...requestedUserIds, ...requestedIds] // Filter out users followed by the user, the user itself, and users who have sent requests to the user
            }
        });
        res.json({ result, requests });
    }
});



const connectUser = asyncHandler(async (req, res) => {
    const connectId = req.query.connectId;
    const userId = req.query.userId;

    // Check if a connection already exists for the userId
    let existingConnection = await connectionRequests.findOne({ $and: [{ From: userId }, { To: connectId }] });

    if (existingConnection) {
        res.status(200).json({ id: connectId, success: true });
    } else {
        // If the connection does not exist, create a new one
        const newConnection = new connectionRequests({
            From: userId,
            To: new ObjectId(connectId)
        });
        await newConnection.save();
        res.status(201).json({ id: connectId, success: true });
    }
});


const listRequests = asyncHandler(async (req, res) => {
    const userId = req.query.userId

    const requests = await connectionRequests.aggregate([
        {
            $match: { To: new ObjectId(userId) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'From',
                foreignField: '_id',
                as: 'user'
            }
        }
    ])

    res.json(requests)

})

const acceptRequest = asyncHandler(async (req, res) => {
    const userId = req.query.userId;
    const connectId = req.query.connectId;

    // Find existing connections for both users
    let existingConnectionUser = await Connections.findOne({ userId: userId });
    let existingConnectionRequestor = await Connections.findOne({ userId: connectId });

    // Update connections if they already exist
    if (existingConnectionUser) {
        // Add connectId to user's followersList
        existingConnectionUser.followersList.push(new ObjectId(connectId));
        await existingConnectionUser.save();
    } else {
        // Create new connections if they don't exist
        const newUserConnection = new Connections({
            userId: userId,
            followersList: [new ObjectId(connectId)]
        });
        await newUserConnection.save();
    }

    if (existingConnectionRequestor) {
        // Add userId to requestor's followersList
        existingConnectionRequestor.followersList.push(new ObjectId(userId));
        await existingConnectionRequestor.save();
    }
    else {
        const newRequestorConnection = new Connections({
            userId: connectId,
            followersList: [new ObjectId(userId)]
        });
        await newRequestorConnection.save();
    }

    // Remove the connection request from connectionRequests
    await connectionRequests.deleteOne({ From: connectId, To: userId });

    // Respond with success
    res.status(200).json({ success: true });
});


const ListConnections = asyncHandler(async (req, res) => {
    const userId = req.query.userId;

    const getConnections = await Connections.aggregate([
        {
            $match: { userId: new ObjectId(userId) }
        },
        {
            $unwind: '$followersList'
        },
        {
            $lookup: {
                from: 'users',
                localField: 'followersList',
                foreignField: '_id',
                as: 'user'
            }
        }
    ]);

    res.json(getConnections);
})


const visitProfile = asyncHandler(async (req, res) => {
    const userId = req.query.userId

    const ogId = req.query.ogId

    const user = await Users.aggregate([
        {
            $match: { _id: new ObjectId(userId) }
        },
        {
            $lookup: {
                from: 'industries',
                localField: 'industryType',
                foreignField: '_id',
                as: 'industry'
            }
        }
    ])

    const connections = await Connections.aggregate([
        {
            $match: { userId: new ObjectId(userId) }
        },
        {
            $unwind: '$followersList'
        },
        {
            $lookup: {
                from: 'users',
                localField: 'followersList',
                foreignField: '_id',
                as: 'user'
            }
        }
    ])

    let existingConnectionUser = await Connections.findOne({ userId: ogId });
    let existingRequest = await connectionRequests.findOne({ $and: [{ From: ogId }, { To: userId }] })

    const posts = await Post.find({ userId: userId });

    // Create an array to store detailed posts (with comments)
    const detailedPosts = [];

    // Fetch saved posts for the user
    const savedItemsDocument = await SavedPosts.findOne({ userId : ogId }).select('savedItems');

    // Check if savedItemsDocument is null or undefined
    const isSavedItemsPresent = savedItemsDocument && savedItemsDocument.savedItems;

    // Iterate through each post and fetch comments with user details
    for (const post of posts) {
        const detailedPost = { ...post.toObject() };

        if (isSavedItemsPresent) {
            detailedPost.isSaved = savedItemsDocument.savedItems.includes(post._id.toString());
        } else {
            // If no savedItems document is found, assume none of the posts are saved
            detailedPost.isSaved = false;
        }

        // Fetch comments for the current post
        const comments = await Comment.aggregate([
            {
                $match: { postId: post._id },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'ownerDetails',
                },
            },
        ]);

        // Add comments to the detailed post
        detailedPost.comments = comments;

        // Add the detailed post to the array
        detailedPosts.push(detailedPost);
    }

    let skills = []

    if (user[0].roles.includes('user')) {
        skills = await userSkills.findOne({ userId: userId })
    }

    const isConnected = existingConnectionUser && existingConnectionUser.followersList.includes(userId);
    if (existingRequest) {
        user[0].isRequested = true
    }
    // Add the isConnected field to the user object
    user[0].isConnected = isConnected;

    const responseData = {
        user,
        connections,
        detailedPosts,
        skills
    };

    // Send the combined data to the frontend
    res.json(responseData);

})


export {
    listUsers,
    connectUser,
    listRequests,
    acceptRequest,
    ListConnections,
    visitProfile
}