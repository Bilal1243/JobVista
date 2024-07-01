import express from 'express'

const adminRouter = express.Router()

import {protect} from '../Middlewares/adminAuthMiddleware.js'
import {acceptJobPost, acceptRecruiter, addIndustries, addSkills, auth,blockRecruiter,blockUser,editIndustryType,editSkill,getJobRequests,getRecruiterRequests,getRecruiters,getSkills,getUsers,listIndustries, listSkills, loadDashboard, unBlockUser, unblockRecruiter, unlistSkills} from '../Controllers/adminController.js'

adminRouter.post('/adminAuth',auth)

adminRouter.get('/',protect,loadDashboard)

adminRouter.get('/getIndustries',protect,listIndustries)
adminRouter.post('/addIndustry',protect,addIndustries)
adminRouter.post('/editIndustry',protect,editIndustryType)


adminRouter.get('/getSkills',protect,getSkills)
adminRouter.post('/addSkill',protect,addSkills)
adminRouter.post('/editSkill',protect,editSkill)
adminRouter.post('/listSkill',protect,listSkills)
adminRouter.post('/unlistSkill',protect,unlistSkills)

adminRouter.get('/getRecruiterRequests',protect,getRecruiterRequests)
adminRouter.post('/acceptRecruiter',protect,acceptRecruiter)

adminRouter.get('/getUsers',protect,getUsers)
adminRouter.post('/blockUser',protect,blockUser)
adminRouter.post('/unblockUser',protect,unBlockUser)

adminRouter.get('/getJobRequests',protect,getJobRequests)
adminRouter.post('/acceptJob',protect,acceptJobPost)

adminRouter.get('/getRecruiters',protect,getRecruiters)
adminRouter.post('/blockRecruiter',protect,blockRecruiter)
adminRouter.post('/unblockRecruiter',protect,unblockRecruiter)


export default adminRouter