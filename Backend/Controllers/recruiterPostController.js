import Industries from '../Models/industriesModel.js'
import userSkills from '../Models/userSkillsModel.js'
import Skills from '../Models/skillsModel.js'
import JobPreference from '../Models/JobPreferenceModel.js'
import Posts from '../Models/postsModel.js'
import Comment from '../Models/commentsModel.js'
import Users from '../Models/userModel.js'
import SavedPosts from '../Models/SavedPostsModel.js'

import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types


const recruiterMyPosts = asyncHandler(async (req, res) => {
    const recruiterId = req.query.recruiterId;

    const data = await Users.aggregate([
        {
            $match: {
                _id: new ObjectId(recruiterId),
            },
        },
        {
            $lookup: {
                from: 'industries',
                localField: 'industryType',
                foreignField: '_id',
                as: 'industry',
            },
        },
        {
            $project: {
                _id: 1,
                userName: { $concat: ['$firstName', ' ', '$lastName'] },
                companyName: 1,
                title: 1,
                email: 1,
                mobile: 1,
                industryType: '$industry.industryName',
                gender: 1,
                location: 1,
                education: 1,
                profileImg: 1,
                isBlocked: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    // Fetch posts for the user
    const posts = await Posts.find({ userId: recruiterId });

    // Create an array to store detailed posts (with comments)
    const detailedPosts = [];

    // Iterate through each post and fetch comments with user details
    for (const post of posts) {
        const detailedPost = { ...post.toObject() };

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

    res.json({ data, detailedPosts });
});



const recruiterCreatePost = asyncHandler(async (req, res) => {

    const { recruiterId, description } = req.body

    const mediaItems = req.files && Array.isArray(req.files) ? req.files.map(file => file.filename) : [];

    const newPost = await Posts.create({
        userId: recruiterId,
        description,
        mediaItems
    })

    if (newPost) {
        res.status(201).json({ success: true })
    }
    else {
        res.status(401)
        throw new Error('server error occured')
    }

})

const recruiterlikePost = asyncHandler(async (req, res) => {
    const postId = req.query.postId; // Assuming the post ID is included in the request parameters
    const recruiterId = req.recruiter._id; // Assuming you have user information in req.user (if using authentication)

    // Check if the user has already liked the post
    const existingLike = await Posts.findOne({ _id: postId, 'likes.users': recruiterId });

    if (existingLike) {
        // If the user has already liked the post, unlike it
        const updatedPost = await Posts.findOneAndUpdate(
            { _id: postId, 'likes.users': recruiterId },
            {
                $inc: { 'likes.count': -1 },
                $pull: { 'likes.users': recruiterId },
            },
            { new: true }
        );

        res.json(updatedPost);
    } else {
        // If the user hasn't liked the post, like it
        const updatedPost = await Posts.findOneAndUpdate(
            { _id: postId },
            {
                $inc: { 'likes.count': 1 },
                $push: { 'likes.users': recruiterId },
            },
            { new: true }
        );

        res.json(updatedPost);
    }
});

const recruiterpostComment = asyncHandler(async (req, res) => {
    const { postId, ownerId, content } = req.body

    const newComment = await Comment.create({
        postId,
        ownerId,
        content
    })

    if (newComment) {
        res.status(201).json(newComment)
    }
    else {
        res.status(401)
        throw new Error("failed to add comment")
    }

})

const recruiterdeleteComment = asyncHandler(async (req, res) => {
    const commentId = req.query.commentId


    const deleted = await Comment.deleteOne({ _id: commentId })

    if (deleted) {
        res.json({ success: true })
    }
    else {
        res.status(401)
        throw new Error("some thing error occured")
    }
})


const recruiterdeletePost = asyncHandler(async (req, res) => {

    const postId = req.query.postId

    const deletePosts = await Posts.deleteOne({ _id: postId })

    const deleteComments = await Comment.deleteMany({ postId: postId })

    if (deletePosts && deleteComments) {
        res.status(201).json({ success: true })
    }
    else {
        res.status(401)
        throw new Error("something error occured")
    }

})

const recruitereditPost = asyncHandler(async (req, res) => {
    const description = req.query.description
    const postId = req.query.postId

    const updatePost = await Posts.findByIdAndUpdate(postId, { description: description })

    if (updatePost) {
        res.status(201).json({ success: true })
    }
    else {
        res.status(401)
        throw new Error("something error occured")
    }

})

const recruiterlistAllPosts = asyncHandler(async (req, res) => {
    const userId = req.recruiter._id; // Assuming you have the user ID in the request object

    // Fetch posts for the user
    const posts = await Posts.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        }
    ]);

    // Fetch saved posts for the user
    const savedItemsDocument = await SavedPosts.findOne({ userId }).select('savedItems');

    // Create an array to store detailed posts (with comments and isSaved)
    const detailedPosts = [];

    // Check if savedItemsDocument is null or undefined
    const isSavedItemsPresent = savedItemsDocument && savedItemsDocument.savedItems;

    // Iterate through each post and fetch comments with user details
    for (const post of posts) {
        const detailedPost = { ...post };

        // Check if the post is saved by the user
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

    res.json(detailedPosts);
});


const recruitersavePost = asyncHandler(async (req, res) => {
    const { recruiterId, postId } = req.query;

    const existing = await SavedPosts.findOne({ userId: recruiterId });

    if (existing) {
        const postExist = await SavedPosts.findOne({ userId: recruiterId, savedItems: new ObjectId(postId) });

        if (postExist) {
            return res.json({ postExist: true });
        }

        // Use new keyword with mongoose.Types.ObjectId
        await SavedPosts.updateOne({ userId: recruiterId }, { $addToSet: { savedItems: new mongoose.Types.ObjectId(postId) } });
    } else {
        // Use new keyword with mongoose.Types.ObjectId
        await SavedPosts.create({ userId: recruiterId, savedItems: [new mongoose.Types.ObjectId(postId)] });
    }

    res.json({ success: true });
})

const recruiterunsavePost = asyncHandler(async (req, res) => {
    const { recruiterId, postId } = req.query;

    const alreadySaved = await SavedPosts.findOne({ userId: recruiterId, savedItems: new ObjectId(postId) });

    if (alreadySaved) {
        await SavedPosts.findOneAndUpdate(
            { userId: recruiterId, savedItems: new ObjectId(postId) },
            { $pull: { savedItems: new ObjectId(postId) } }
        );
    }

    res.json({ success: true });
});

const recruiterlistSavedPosts = asyncHandler(async (req, res) => {
    const userId = req.recruiter._id;


    const posts = await SavedPosts.aggregate([
        {
            $match: { userId: userId }
        },
        {
            $unwind: '$savedItems'
        },
        {
            $lookup: {
                from: 'posts',
                localField: 'savedItems',
                foreignField: '_id',
                as: 'post'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'post.userId',
                foreignField: '_id',
                as: 'postOwner'
            }
        }
    ]);

    const detailedPosts = [];

    for (const post of posts) {
        const detailedPost = { ...post };


        // Fetch comments for the current post
        const comments = await Comment.aggregate([
            {
                $match: { postId: post.savedItems },
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

    res.json(detailedPosts);
});


export {
    recruiterCreatePost,
    recruiterlikePost,
    recruiterMyPosts,
    recruiterpostComment,
    recruiterdeleteComment,
    recruiterdeletePost,
    recruitereditPost,
    recruiterlistAllPosts,
    recruiterlistSavedPosts,
    recruitersavePost,
    recruiterunsavePost
}