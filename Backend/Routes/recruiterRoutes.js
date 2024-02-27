import express from 'express'

const recruiterRoute = express.Router()


import ProfileUpload from '../config/ProfileMulter.js'
import PostUpload from '../config/createPostMulter.js'


import { protect } from '../Middlewares/recruiterAuthMiddleware.js'
import { filterJobByLocation, listIndustries, listJobs, listSkills, logoutRecruiter, recruiterAddnewPassword, recruiterAuth, recruiterEditProfile, recruiterchangePassword, recruiterforgotPassVerify, recruiterloadMyProfile, recruiterverifyOtp, registerRecruiter, searchJob, verifyRecruiter } from '../Controllers/recruiterController.js'
import { changeStatus, createJob, editJob, getResume, viewApplications } from '../Controllers/recruiterJobController.js'
import { recruiterCreatePost, recruiterMyPosts, recruiterdeleteComment, recruiterdeletePost, recruitereditPost, recruiterlikePost, recruiterlistAllPosts, recruiterlistSavedPosts, recruiterpostComment, recruitersavePost, recruiterunsavePost } from '../Controllers/recruiterPostController.js'
import { ListConnections, acceptRequest, connectUser, listRequests, listUsers, visitProfile } from '../Controllers/MyNetworkController.js'
import { chatSend, createRoom, getMessages, getRooms } from '../Controllers/ChatController.js'


recruiterRoute.post('/recruiterAuth', recruiterAuth)
recruiterRoute.post('/sendOtp', registerRecruiter)
recruiterRoute.post('/verifyRecruiter', ProfileUpload.single("profileImg"), verifyRecruiter)

recruiterRoute.get('/recruiterEmailVerify', recruiterforgotPassVerify)
recruiterRoute.post('/recruiterverifyOtp', recruiterverifyOtp)
recruiterRoute.put('/recruiteraddNewPass', recruiterAddnewPassword)

recruiterRoute.get('/getIndustries', listIndustries)

recruiterRoute.get('/listSkills', protect, listSkills)

recruiterRoute.get('/networkRequest', protect, listRequests)
recruiterRoute.get('/MyNetwork', protect, listUsers)
recruiterRoute.put('/connect', protect, connectUser)
recruiterRoute.put('/acceptRequest', protect, acceptRequest)

recruiterRoute.get('/visitProfile', protect, visitProfile)

recruiterRoute.get('/listConnections', protect, ListConnections)


recruiterRoute.post('/postJob', protect, createJob)
recruiterRoute.get('/recruiterListPosts', protect, recruiterlistAllPosts)
recruiterRoute.put('/recruiterSavePost', protect, recruitersavePost)
recruiterRoute.put('/recruiterUnSavePost', protect, recruiterunsavePost)

recruiterRoute.get('/getMyjobs', protect, listJobs)
recruiterRoute.get('/searchJob', protect, searchJob)
recruiterRoute.get('/filterByLocation', protect, filterJobByLocation)
recruiterRoute.get('/viewJobDetails', protect, viewApplications)
recruiterRoute.put('/changeStatus', protect, changeStatus)
recruiterRoute.get('/loadResume', protect, getResume)
recruiterRoute.put('/editJob', protect, editJob)

recruiterRoute.get('/loadMyProfile', protect, recruiterloadMyProfile)
recruiterRoute.post('/recruiterEditProfile', protect, ProfileUpload.single("profileImg"), recruiterEditProfile);
recruiterRoute.post('/createPost', protect, PostUpload.array('mediaItems', Infinity), recruiterCreatePost)
recruiterRoute.get('/getMyPosts', protect, recruiterMyPosts)
recruiterRoute.put('/likePost', protect, recruiterlikePost)
recruiterRoute.post('/addComment', protect, recruiterpostComment)
recruiterRoute.get('/deleteComment', protect, recruiterdeleteComment)
recruiterRoute.get('/deletePost', protect, recruiterdeletePost)
recruiterRoute.put('/editPost', protect, recruitereditPost)
recruiterRoute.get('/recruiterSavedPosts', protect, recruiterlistSavedPosts)


recruiterRoute.get('/getChats', protect, getRooms)
recruiterRoute.post('/createChat', protect, createRoom)
recruiterRoute.post('/sendMessage', protect, chatSend)
recruiterRoute.post('/getMessages', protect, getMessages)


recruiterRoute.put('/recruiterChangePassword', protect, recruiterchangePassword)

recruiterRoute.get('/logout', protect, logoutRecruiter)

export default recruiterRoute