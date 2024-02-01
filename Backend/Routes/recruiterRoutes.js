import express from 'express'

const recruiterRoute = express.Router()


import ProfileUpload from '../config/ProfileMulter.js'
import PostUpload from '../config/createPostMulter.js'


import { protect } from '../Middlewares/recruiterAuthMiddleware.js'
import {  filterJobByLocation, listIndustries, listJobs, listSkills, recruiterAuth, recruiterEditProfile, recruiterloadMyProfile, registerRecruiter, searchJob, verifyRecruiter } from '../Controllers/recruiterController.js'
import { changeStatus, createJob, getResume, viewApplications } from '../Controllers/recruiterJobController.js'
import { recruiterCreatePost, recruiterMyPosts, recruiterdeleteComment, recruiterdeletePost, recruitereditPost, recruiterlikePost, recruiterpostComment } from '../Controllers/recruiterPostController.js'


recruiterRoute.post('/recruiterAuth', recruiterAuth)
recruiterRoute.post('/sendOtp', registerRecruiter)
recruiterRoute.post('/verifyRecruiter', ProfileUpload.single("profileImg"), verifyRecruiter)

recruiterRoute.get('/getIndustries', listIndustries)

recruiterRoute.get('/listSkills', protect, listSkills)

recruiterRoute.post('/postJob', protect, createJob)

recruiterRoute.get('/getMyjobs', protect, listJobs)
recruiterRoute.get('/searchJob', protect, searchJob)
recruiterRoute.get('/filterByLocation', protect, filterJobByLocation)
recruiterRoute.get('/viewJobDetails', protect, viewApplications)
recruiterRoute.put('/changeStatus', protect, changeStatus)
recruiterRoute.get('/loadResume', protect, getResume)

recruiterRoute.get('/loadMyProfile', protect, recruiterloadMyProfile)
recruiterRoute.post('/recruiterEditProfile', protect, ProfileUpload.single("profileImg"), recruiterEditProfile);
recruiterRoute.post('/createPost',protect,PostUpload.array('mediaItems',Infinity),recruiterCreatePost)
recruiterRoute.get('/getMyPosts',protect,recruiterMyPosts)
recruiterRoute.put('/likePost',protect,recruiterlikePost)
recruiterRoute.post('/addComment',protect,recruiterpostComment)
recruiterRoute.get('/deleteComment',protect,recruiterdeleteComment)
recruiterRoute.get('/deletePost',protect,recruiterdeletePost)
recruiterRoute.put('/editPost',protect,recruitereditPost)

export default recruiterRoute