import express from 'express'

const userRoute = express.Router()
import { protect } from '../Middlewares/userAuthMiddleware.js'
import PostUpload from '../config/createPostMulter.js'
import ProfileUpload from '../config/ProfileMulter.js'
import ResumeUpload from '../config/ResumeMulter.js'

import {
    AddjobPreference,
    authUser,
    changePassword,
    editProfile,
    jobStatusList,
    listIndustries,
    listSavedJobs,
    listSkills,
    listjobPreferencePage,
    loadMyProfile,
    logoutUser,
    registerUser,
    removeSkill,
    saveSkills,
    verifyRegistration
}
    from '../Controllers/userController.js'

import { MyPosts, CreatePost, deleteComment, deletePost, likePost, postComment, editPost, listAllPosts, savePost, unsavePost, listSavedPosts } from '../Controllers/userPostController.js'
import { SearchJob, applyJob, getJob, listJobs, saveJob, unsaveJob } from '../Controllers/userJobControler.js'
import { ListConnections, acceptRequest, connectUser, listRequests, listUsers, visitProfile } from '../Controllers/MyNetworkController.js'

userRoute.post('/auth', authUser)
userRoute.post('/register', registerUser)
userRoute.post('/verifyRegistration', verifyRegistration)
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
userRoute.put('/acceptRequest',protect,acceptRequest)

userRoute.get('/listConnections',protect,ListConnections)
userRoute.get('/visitProfile',protect,visitProfile)


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


userRoute.get('/listJobs', protect, listJobs)
userRoute.put('/saveJob', protect, saveJob)
userRoute.put('/unSaveJob', protect, unsaveJob)
userRoute.get('/viewJob', protect, getJob)
userRoute.get('/searchJob', protect, SearchJob)
userRoute.post('/applyJob', protect, ResumeUpload.single("resume"), applyJob)



userRoute.get('/logout', logoutUser)



export default userRoute