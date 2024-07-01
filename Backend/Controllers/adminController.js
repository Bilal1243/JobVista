import Admin from '../Models/adminModel.js'
import Users from '../Models/userModel.js'
import Skills from '../Models/skillsModel.js'
import industries from '../Models/industriesModel.js'
import Jobs from '../Models/jobsModel.js'
import Post from '../Models/postsModel.js'

import asyncHandler from 'express-async-handler'
import AdmingenarateToken from '../Utils/adminGenerateToken.js'

const auth = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const findAdmin = await Admin.findOne({ email })
  if (findAdmin && (await findAdmin.matchPassword(password))) {
    AdmingenarateToken(res, findAdmin._id);

    res.status(201).json({
      _id: findAdmin._id,
      email: findAdmin.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
})

const listIndustries = asyncHandler(async (req, res) => {
  const Industries = await industries.find()
  res.status(201).json({ data: Industries })
})


const addIndustries = asyncHandler(async (req, res) => {
  const industryName = req.body.industryName
  const exsisting = await industries.findOne({ industryName: { $regex: new RegExp(`^${industryName}$`, 'i') } })
  if (exsisting) {
    res.status(409).json({ message: 'already existing' })
  }
  else {
    const data = await industries.create({
      industryName: industryName
    })
    if (data) {
      res.status(201).json({ data: data })
    }
    else {
      throw new Error("error occured");
    }
  }
})


const addSkills = asyncHandler(async (req, res) => {
  const { skill } = req.body;

  const existing = await Skills.findOne({ skill: { $regex: new RegExp(`^${skill}$`, 'i') } });

  if (existing) {
    return res.json({ success: false, message: 'Skill already exists' });
  } else {
    const savedSkill = await Skills.create({
      skill
    });

    if (savedSkill) {
      res.status(201).json({ success: true, message: 'Skill added successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to add new skill' });
    }
  }
});


const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skills.find()
  res.status(201).json({ data: skills })
})


const editSkill = asyncHandler(async (req, res) => {
  const { skillId, skill } = req.body;

  // Check if the skill already exists in a case-sensitive manner
  const existing = await Skills.findOne({ skill: { $regex: new RegExp(`^${skill}$`, 'i') } });

  if (existing) {
    return res.json({ success: false, message: 'Skill already exists' });
  }
  else {
    const updateSkill = await Skills.findByIdAndUpdate(skillId, { skill: skill });

    if (updateSkill) {
      res.status(201).json({ success: true });
    } else {
      res.status(400);
      throw new Error('Failed to update');
    }
  }
});



const listSkills = asyncHandler(async (req, res) => {

  const { skillId } = req.body

  const updateSkill = await Skills.findByIdAndUpdate(skillId, { isListed: true })

  if (updateSkill) {
    res.status(201).json({ success: true })
  }
  else {
    res.status(400)
    throw new Error('failed to update')
  }

})


const unlistSkills = asyncHandler(async (req, res) => {

  const { skillId } = req.body

  const updateSkill = await Skills.findByIdAndUpdate(skillId, { isListed: false })

  if (updateSkill) {
    res.status(201).json({ success: true })
  }
  else {
    res.status(400)
    throw new Error('failed to update')
  }

})


const getRecruiterRequests = asyncHandler(async (req, res) => {

  const recruiters = await Users.aggregate([
    {
      $match: { isAccepted: false }
    },
    {
      $lookup: {
        from: 'industries',  // Replace with the actual name of your Industries collection
        localField: 'industryType',
        foreignField: '_id', // Corrected to use _id as the foreignField
        as: 'industry'
      }
    },
    {
      $project: {
        _id: 1,
        recruiterName: { $concat: ['$firstName', ' ', '$lastName'] }, // Concatenate first and last name
        title: 1,
        companyName: 1,
        email: 1,
        mobile: 1,
        industryType: '$industry.industryName', // Replace 'type' with the actual field in Industries
        gender: 1,
        location: 1,
        education: 1,
        profileImg: 1,
        isAccepted: 1,
        isBlocked: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }
  ]);

  res.status(201).json({ data: recruiters })

})

const acceptRecruiter = asyncHandler(async (req, res) => {
  const { recruiterId } = req.body

  const updateRecruiter = await Users.findByIdAndUpdate(recruiterId, { isAccepted: true, });

  if (updateRecruiter) {
    res.status(201).json({ message: 'updated successfully' })
  }
  else {
    res.status(400)
    throw new Error('some thing error occured')
  }

})


const getUsers = asyncHandler(async (req, res) => {

  const users = await Users.aggregate([
    {
      $match: {
        roles: { $nin: ['recruiter'] }
      }
    },
    {
      $lookup: {
        from: 'industries',  // Replace with the actual name of your Industries collection
        localField: 'industryType',
        foreignField: '_id', // Corrected to use _id as the foreignField
        as: 'industry'
      }
    },
    {
      $project: {
        _id: 1,
        userName: { $concat: ['$firstName', ' ', '$lastName'] }, // Concatenate first and last name
        title: 1,
        email: 1,
        mobile: 1,
        industryType: '$industry.industryName', // Replace 'type' with the actual field in Industries
        gender: 1,
        location: 1,
        education: 1,
        profileImg: 1,
        isBlocked: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }
  ]);

  res.status(201).json({ data: users })

})


const blockUser = asyncHandler(async (req, res) => {

  const { userId } = req.body

  const findUser = await Users.findByIdAndUpdate(userId, { isBlocked: true })

  if (findUser) {
    res.status(201).json({ success: true, message: 'Blocked successfully' })
  }
  else {
    res.status(400)
    throw new Error('some thing error occured')
  }

})

const unBlockUser = asyncHandler(async (req, res) => {

  const { userId } = req.body

  const findUser = await Users.findByIdAndUpdate(userId, { isBlocked: false })

  if (findUser) {
    res.status(201).json({ success: true, message: 'Blocked successfully' })
  }
  else {
    res.status(400)
    throw new Error('some thing error occured')
  }

})

const getJobRequests = asyncHandler(async (req, res) => {

  const jobs = await Jobs.aggregate([
    {
      $match: {
        isAccepted: false
      }
    },
    {
      $lookup: {
        from: 'industries',
        localField: 'industryType',
        foreignField: '_id',
        as: 'industry'
      }
    },
    {
      $project: {
        _id: 1,
        jobRole: 1, // Concatenate first and last name
        company: 1,
        email: 1,
        mobile: 1,
        industryType: '$industry.industryName', // Replace 'type' with the actual field in Industries
        salaryRange: 1,
        experience: 1,
        reqQualification: 1,
        jobType: 1,
        deadline: 1,
        description: 1,
        location: 1,
        skills: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }
  ])


  res.status(201).json({ data: jobs })

})


const acceptJobPost = asyncHandler(async (req, res) => {
  const { id } = req.body

  const updateJob = await Jobs.findByIdAndUpdate(id, { isAccepted: true, });

  if (updateJob) {
    res.status(201).json({ message: 'updated successfully' })
  }
  else {
    res.status(400)
    throw new Error('some thing error occured')
  }

})

const editIndustryType = asyncHandler(async (req, res) => {
  const { id, industryName } = req.body;

  const exsisting = await industries.findOne({ industryName: { $regex: new RegExp(`^${industryName}$`, 'i') } })

  if (exsisting) {
    res.status(409).json({ message: 'already existing' })
  }
  else {
    const updateSkill = await industries.findByIdAndUpdate(id, { industryName: industryName }, { new: true });

    if (updateSkill) {
      res.status(201).json({ success: true, data: updateSkill });
    } else {
      res.status(400);
      throw new Error('Failed to update');
    }
  }

});

const getRecruiters = asyncHandler(async (req, res) => {

  const users = await Users.aggregate([
    {
      $match: {
        roles: { $in: ['recruiter'] }
      }
    },
    {
      $lookup: {
        from: 'industries',  // Replace with the actual name of your Industries collection
        localField: 'industryType',
        foreignField: '_id', // Corrected to use _id as the foreignField
        as: 'industry'
      }
    },
    {
      $project: {
        _id: 1,
        userName: { $concat: ['$firstName', ' ', '$lastName'] }, // Concatenate first and last name
        title: 1,
        companyName: 1,
        email: 1,
        mobile: 1,
        industryType: '$industry.industryName', // Replace 'type' with the actual field in Industries
        gender: 1,
        location: 1,
        education: 1,
        profileImg: 1,
        isBlocked: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }
  ]);

  res.status(201).json({ data: users })

})

const blockRecruiter = asyncHandler(async (req, res) => {

  const { recruiterId } = req.body

  const findUser = await Users.findByIdAndUpdate(recruiterId, { isBlocked: true })

  if (findUser) {
    res.status(201).json({ success: true, message: 'Blocked successfully' })
  }
  else {
    res.status(400)
    throw new Error('some thing error occured')
  }

})

const unblockRecruiter = asyncHandler(async (req, res) => {

  const { recruiterId } = req.body

  const findUser = await Users.findByIdAndUpdate(recruiterId, { isBlocked: false })

  if (findUser) {
    res.status(201).json({ success: true, message: 'Blocked successfully' })
  }
  else {
    res.status(400)
    throw new Error('some thing error occured')
  }

})

const loadDashboard = asyncHandler(async (req, res) => {

  const users = await Users.aggregate([
    {
      $match: {
        roles: 'user'
      }
    },
    {
      $lookup: {
        from: 'industries',
        localField: 'industryType',
        foreignField: '_id',
        as: 'industry'
      }
    }
  ]);


  const recruiters = await Users.aggregate([
    {
      $match: {
        roles: 'recruiter'
      }
    },
    {
      $lookup: {
        from: 'industries',
        localField: 'industryType',
        foreignField: '_id',
        as: 'industry'
      }
    }
  ]);

  const posts = await Post.find()

  const jobs = await Jobs.find()

  const response = {users,recruiters,posts,jobs}

  res.json(response)

})



export {
  auth,
  listIndustries,
  addIndustries,
  addSkills,
  getSkills,
  getRecruiterRequests,
  acceptRecruiter,
  getUsers,
  blockUser,
  unBlockUser,
  editSkill,
  listSkills,
  unlistSkills,
  getJobRequests,
  acceptJobPost,
  editIndustryType,
  getRecruiters,
  blockRecruiter,
  unblockRecruiter,
  loadDashboard
}