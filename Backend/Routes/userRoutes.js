import express from 'express'

const userRoute = express.Router()
import { protect } from '../Middlewares/userAuthMiddleware.js'
import PostUpload from '../config/createPostMulter.js'
import ProfileUpload from '../config/ProfileMulter.js'
import ResumeUpload from '../config/ResumeMulter.js'

import {
    AddDetails,
    AddjobPreference,
    AddnewPassword,
    addExperience,
    authUser,
    changePassword,
    editProfile,
    forgotPassVerify,
    googleRegister,
    jobStatusList,
    listExperience,
    listIndustries,
    listSavedJobs,
    listSkills,
    listjobPreferencePage,
    loadMyProfile,
    logoutUser,
    registerUser,
    removeSkill,
    saveSkills,
    verifyOtp,
    verifyRegistration
}
    from '../Controllers/userController.js'

import { MyPosts, CreatePost, deleteComment, deletePost, likePost, postComment, editPost, listAllPosts, savePost, unsavePost, listSavedPosts } from '../Controllers/userPostController.js'
import { SearchJob, applyJob, getJob, listJobs, saveJob, unsaveJob } from '../Controllers/userJobControler.js'
import { ListConnections, acceptRequest, connectUser, listRequests, listUsers, visitProfile } from '../Controllers/MyNetworkController.js'
import { chatSend, createRoom, getMessages, getRooms } from '../Controllers/ChatController.js'

userRoute.post('/auth', authUser)
userRoute.post('/register', registerUser)
userRoute.post('/googleRegister', ProfileUpload.single('profileImg'), googleRegister)
userRoute.post('/addDetails', AddDetails)
userRoute.post('/verifyRegistration', verifyRegistration)

userRoute.get('/forgotEmailVerify', forgotPassVerify)
userRoute.post('/verifyOtp',verifyOtp)
userRoute.put('/addNewPass', AddnewPassword)

userRoute.post('/addJobPreference', AddjobPreference)
userRoute.post('/addSkills', saveSkills)


userRoute.get('/getSkills', listSkills)
userRoute.get('/getIndustries', listIndustries)

userRoute.get('/listPosts', protect, listAllPosts)
userRoute.put('/savepost', protect, savePost)
userRoute.put('/unSavepost', protect, unsavePost)

userRoute.get('/networkRequest', protect, listRequests)
userRoute.get('/MyNetwork', protect, listUsers)
userRoute.put('/connect', protect, connectUser)
userRoute.put('/acceptRequest', protect, acceptRequest)

userRoute.get('/listConnections', protect, ListConnections)
userRoute.get('/visitProfile', protect, visitProfile)


userRoute.get('/myProfile', protect, loadMyProfile)
userRoute.post('/editProfile', protect, ProfileUpload.single("profileImg"), editProfile);
userRoute.get('/myPosts', protect, MyPosts)
userRoute.post('/createPost', protect, PostUpload.array('mediaItems', Infinity), CreatePost)
userRoute.put('/likePost', protect, likePost)
userRoute.post('/addComment', protect, postComment)
userRoute.get('/deleteComment', protect, deleteComment)
userRoute.get('/deletePost', protect, deletePost)
userRoute.put('/editPost', protect, editPost)
userRoute.get('/jobPreferencePage', protect, listjobPreferencePage)
userRoute.put('/removeSkill', protect, removeSkill)
userRoute.get('/savedJobs', protect, listSavedJobs)
userRoute.put('/changePassword', protect, changePassword)
userRoute.get('/getJobStatus', protect, jobStatusList)
userRoute.get('/SavedPosts', protect, listSavedPosts)

userRoute.get('/listExperience', protect, listExperience)
userRoute.post('/addExperience', protect, addExperience)


userRoute.get('/listJobs', protect, listJobs)
userRoute.put('/saveJob', protect, saveJob)
userRoute.put('/unSaveJob', protect, unsaveJob)
userRoute.get('/viewJob', protect, getJob)
userRoute.get('/searchJob', protect, SearchJob)
userRoute.post('/applyJob', protect, ResumeUpload.single("resume"), applyJob)

userRoute.get('/getChats', protect, getRooms)
userRoute.post('/createChat', protect, createRoom)
userRoute.post('/sendMessage', protect, chatSend)
userRoute.post('/getMessages', protect, getMessages)



userRoute.get('/logout', logoutUser)



export default userRoute