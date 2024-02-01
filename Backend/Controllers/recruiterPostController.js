import Recruiters from "../Models/recruiterModel.js";
import Industries from '../Models/industriesModel.js'
import userSkills from '../Models/userskillsModel.js'
import Skills from '../Models/skillsModel.js'
import JobPreference from '../Models/JobPreferenceModel.js'
import Followers from '../Models/followersModel.js'
import Posts from '../Models/postsModel.js'
import Comment from '../Models/commentsModel.js'

import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types


const recruiterMyPosts = asyncHandler(async (req, res) => {
    const recruiterId = req.recruiter._id;

    const data = await Recruiters.aggregate([
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
                company: 1,
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
                    from: 'recruiters',
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

    // Now, detailedPosts contains posts with comments, along with the username and profileImg of commenters
    // You can send detailedPosts as the response or process it further as needed
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

    console.log(commentId)

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


export {
    recruiterCreatePost,
    recruiterlikePost,
    recruiterMyPosts,
    recruiterpostComment,
    recruiterdeleteComment,
    recruiterdeletePost,
    recruitereditPost
}