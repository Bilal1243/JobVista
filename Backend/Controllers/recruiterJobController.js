import asyncHandler from 'express-async-handler'

import Users from '../Models/userModel.js'
import Industries from '../Models/industriesModel.js'
import Skills from '../Models/skillsModel.js'
import Jobs from '../Models/jobsModel.js'
import jobApplications from '../Models/applicationModel.js'
import JobQuestions from '../Models/JobQuestions.js'
import nodeMailer from 'nodemailer'

import mongoose from 'mongoose'
const { ObjectId } = mongoose.Types


const createJob = asyncHandler(async (req, res) => {

    const { recruiterId, skills, openings, jobRole, jobType, rate, industryType, experience, qualification, company, location, salaryRange, deadline, description, contactAllowed, questions } = req.body

    const findRecruiter = await Users.findOne({ _id: recruiterId })

    const email = contactAllowed ? findRecruiter.email : null

    const mobile = contactAllowed ? findRecruiter.mobile : null

    const saveJob = await Jobs.create({
        recruiterId,
        jobRole,
        industryType,
        rate,
        openings,
        company,
        description,
        qualification,
        jobType,
        experience,
        salaryRange,
        location,
        skills,
        email,
        mobile,
        deadline
    })

    if (saveJob) {
        if (questions.length > 0) {
            const createQuestion = await JobQuestions.create({
                jobId: saveJob._id,
                questions
            });

            if (createQuestion) {
                res.status(201).json({ success: true });
            } else {
                // Handle the case when createQuestion is falsy (e.g., not created successfully)
                res.status(500).json({ success: false, error: "Failed to create question" });
            }
        }
        else {
            res.status(201).json({ success: true });
        }

    } else {
        res.status(400)
        throw new Error('server error')
    }

})

const viewApplications = asyncHandler(async (req, res) => {
    const jobId = req.query.jobId;

    const applications = await Jobs.aggregate([
        {
            $match: { _id: new ObjectId(jobId) }
        },
        {
            $lookup: {
                from: 'jobapplications',
                localField: '_id',
                foreignField: 'jobId',
                as: 'applicants'
            }
        },
        {
            $unwind: '$applicants'
        },
        {
            $lookup: {
                from: 'users',
                localField: 'applicants.userId',
                foreignField: '_id',
                as: 'applicantDetails'
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: ['$applicants', { ownerDetails: { $arrayElemAt: ['$applicantDetails', 0] } }]
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                applications: { $push: '$$ROOT' }
            }
        },
        {
            $replaceRoot: {
                newRoot: { $arrayElemAt: ['$applications', 0] }
            }
        }
    ]);

    const jobDetails = await Jobs.findOne({ _id: jobId });

    res.json({ applications, jobDetails }); // Assuming you expect a single job details document
});

const changeStatus = asyncHandler(async (req, res) => {
    const status = req.query.status
    const applicationId = req.query.applicationId


    const updateStatus = await jobApplications.findByIdAndUpdate({ _id: applicationId }, { applicationStatus: status })

    if (status === 'selected') {
        const updateJob = await Jobs.findByIdAndUpdate({ _id: updateStatus.jobId }, { recruited: true })
    }

    const jobDetails = await Jobs.findOne({ _id: updateStatus.jobId })

    const findUser = await Users.findOne({ _id: updateStatus.userId })

    if (updateStatus) {
        const transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        let mailOptions;

        if (status === 'shortlisted' || status === 'on interview process' || status === 'selected') {
            mailOptions = {
                from: process.env.GMAIL_USER,
                to: findUser.email,
                subject: `Update Regarding Your Job Application at ${jobDetails.company}`,
                text: `Dear ${findUser.firstName} ${findUser.lastName},
        
                We wanted to inform you that there has been an update regarding your job application for the position of ${jobDetails.jobRole} at ${jobDetails.company}.
        
                Thank you for your continued interest in our company.
        
                Best regards,
                ${jobDetails.company}`,
            };
        } else if (status === 'rejected') {
            mailOptions = {
                from: process.env.GMAIL_USER,
                to: findUser.email,
                subject: `Regarding Your Job Application at ${jobDetails.company}`,
                text: `Dear ${findUser.firstName} ${findUser.lastName},
        
                We regret to inform you that your application for the position of ${jobDetails.jobRole} at ${jobDetails.company} has been rejected.
        
                Thank you for considering our company.
        
                Best regards,
                ${jobDetails.company}`,
            };
        } else if (status === 'Not shortlisted') {
            mailOptions = {
                from: process.env.GMAIL_USER,
                to: findUser.email,
                subject: `Regarding Your Job Application at ${jobDetails.company}`,
                text: `Dear ${findUser.firstName} ${findUser.lastName},
        
                We regret to inform you that your application for the position of ${jobDetails.jobRole} at ${jobDetails.company} has Not Shortlisted.
        
                Thank you for considering our company.
        
                Best regards,
                ${jobDetails.company}`,
            };
        } else {
            mailOptions = {
                from: process.env.GMAIL_USER,
                to: findUser.email,
                subject: `Regarding Your Job Application at ${jobDetails.company}`,
                text: `Dear ${findUser.firstName} ${findUser.lastName},
        
                Thank you for applying for the position of ${jobDetails.jobRole} at ${jobDetails.company}. We appreciate your interest in our company.
        
                Best regards,
                ${jobDetails.company}`,
            };
        }
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);


        res.json(updateStatus)
    }
    else {
        res.status(400)
        throw new Error('failed to update')
    }

})

const getResume = asyncHandler(async (req, res) => {

    const applicationId = req.query.applicationId

    const findApplication = await jobApplications.aggregate([
        {
            $match: { _id: new ObjectId(applicationId) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        }
    ])
    const applicationWithOwnerDetails = findApplication[0];
    if (applicationWithOwnerDetails && applicationWithOwnerDetails.ownerDetails && applicationWithOwnerDetails.ownerDetails.length > 0) {
        applicationWithOwnerDetails.ownerDetails = applicationWithOwnerDetails.ownerDetails[0];
    }

    res.json(applicationWithOwnerDetails);
})

const editJob = asyncHandler(async (req, res) => {
    const { id, jobRole, openings, description, checked } = req.body

    let updateJob

    if (checked === 'Yes') {
        updateJob = await Jobs.findByIdAndUpdate(id, { jobRole: jobRole, openings: openings, description: description, recruited: true })
    }
    else {
        updateJob = await Jobs.findByIdAndUpdate(id, { jobRole: jobRole, openings: openings, description: description })
    }

    if (updateJob) {
        res.status(200).json({ status: true })
    }
    else {
        res.status(400)
        throw new Error('server error')
    }

})


export {
    createJob,
    viewApplications,
    changeStatus,
    getResume,
    editJob
}