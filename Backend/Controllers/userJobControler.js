import users from "../Models/userModel.js";
import Industries from "../Models/industriesModel.js";
import userSkills from "../Models/userSkillsModel.js";
import Skills from "../Models/skillsModel.js";
import JobPreference from "../Models/JobPreferenceModel.js";
import Posts from "../Models/postsModel.js";
import Comment from "../Models/commentsModel.js";
import Jobs from "../Models/jobsModel.js";
import jobApplications from "../Models/applicationModel.js";
import JobQuestions from '../Models/JobQuestions.js'
import SavedJobs from "../Models/SavedJobsModel.js";

import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

const listJobs = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Fetch user's job preferences
    const userPreference = await JobPreference.findOne({ userId: userId });

    // Get the list of job IDs that the user has applied for
    const appliedJobIds = (await jobApplications.find({ userId }).distinct("jobId")).map(id => id.toString());

    // Get the list of job IDs that the user has saved
    const savedJobIds = await SavedJobs.findOne({ userId }).then((savedJobs) =>
        savedJobs ? savedJobs.savedItems.map(id => id.toString()) : []
    );

    // Find all jobs
    const allJobs = await Jobs.find({ recruited: false }).sort({ createdAt: -1 });

    // Check if each job is saved by the user
    const jobsWithSavedStatus = allJobs.map((job) => {
        const isSaved = savedJobIds.includes(job._id.toString());
        return {
            ...job._doc,
            isSaved: isSaved,
        };
    });

    // Filter out jobs that the user has applied for
    const jobsNotApplied = jobsWithSavedStatus.filter(
        (job) => !appliedJobIds.includes(job._id.toString())
    );

    // Additional filter to exclude applied jobs
    const jobsNotAppliedAndNotSaved = jobsNotApplied.filter(
        (job) => !appliedJobIds.includes(job._id.toString())
    );

    let jobsFilteredByPreferences = []
    if (userPreference) {
        // Filter jobs based on user preferences
        jobsFilteredByPreferences = jobsNotAppliedAndNotSaved.filter((job) => {
            // Customize the logic based on your preferences and job data
            // Here, I'm assuming `userPreference` has a `jobTitle` property
            const isTitleMatch = userPreference.jobTitle === job.jobRole;
            const isTypeMatch = job.jobType.includes(userPreference.jobType)
            const isMinPayMatch =
                userPreference.minPay > job.salaryRange.starting ||
                userPreference.minPay < job.salaryRange.ending;

            // Check if job deadline is valid (greater than current date)
            const currentDateTime = new Date();
            const jobDeadline = new Date(job.deadline);

            return (
                isTitleMatch ||
                isTypeMatch ||
                isMinPayMatch ||
                jobDeadline > currentDateTime
            );
        });
    }

    if (jobsFilteredByPreferences.length > 0) {
        res.json(jobsFilteredByPreferences);
    } else {
        res.json(jobsNotAppliedAndNotSaved);
    }
});



const saveJob = asyncHandler(async (req, res) => {
    const { userId, jobId } = req.query;

    const existing = await SavedJobs.findOne({ userId });

    if (existing) {
        const jobExist = await SavedJobs.findOne({ userId, savedItems: new ObjectId(jobId) });

        if (jobExist) {
            return res.json({ jobExist: true });
        }

        // Use new keyword with mongoose.Types.ObjectId
        await SavedJobs.updateOne({ userId }, { $addToSet: { savedItems: new mongoose.Types.ObjectId(jobId) } });
    } else {
        // Use new keyword with mongoose.Types.ObjectId
        await SavedJobs.create({ userId, savedItems: [new mongoose.Types.ObjectId(jobId)] });
    }

    const updatedJobList = await listJobsHelper(userId);

    res.json({ jobs: updatedJobList });
});


const unsaveJob = asyncHandler(async (req, res) => {
    const { userId, jobId } = req.query;

    const alreadySaved = await SavedJobs.findOne({ userId, savedItems: new ObjectId(jobId) });

    if (alreadySaved) {
        await SavedJobs.findOneAndUpdate(
            { userId, savedItems: new ObjectId(jobId) },
            { $pull: { savedItems: new ObjectId(jobId) } }
        );
    }

    const updatedJobList = await listJobsHelper(userId);

    res.json({ jobs: updatedJobList });
});

// Helper function to get the updated job list
const listJobsHelper = async (userId) => {
    // Fetch user's job preferences
    const userPreference = await JobPreference.findOne({ userId: userId });

    // Get the list of job IDs that the user has applied for
    const appliedJobIds = (await jobApplications.find({ userId }).distinct("jobId")).map(id => id.toString());

    // Get the list of job IDs that the user has saved
    const savedJobIds = await SavedJobs.findOne({ userId }).then((savedJobs) =>
        savedJobs ? savedJobs.savedItems.map(id => id.toString()) : []
    );

    // Find all jobs
    const allJobs = await Jobs.find({ recruited: false }).sort({ createdAt: -1 });

    // Check if each job is saved by the user
    const jobsWithSavedStatus = allJobs.map((job) => {
        const isSaved = savedJobIds.includes(job._id.toString());
        return {
            ...job._doc,
            isSaved: isSaved,
        };
    });

    // Filter out jobs that the user has applied for
    const jobsNotApplied = jobsWithSavedStatus.filter(
        (job) => !appliedJobIds.includes(job._id.toString())
    );

    // Additional filter to exclude applied jobs
    const jobsNotAppliedAndNotSaved = jobsNotApplied.filter(
        (job) => !appliedJobIds.includes(job._id.toString())
    );

    let jobsFilteredByPreferences = []
    if (userPreference) {
        // Filter jobs based on user preferences
        jobsFilteredByPreferences = jobsNotAppliedAndNotSaved.filter((job) => {
            // Customize the logic based on your preferences and job data
            // Here, I'm assuming `userPreference` has a `jobTitle` property
            const isTitleMatch = userPreference.jobTitle === job.jobRole;
            const isTypeMatch = userPreference.jobType === job.jobType;
            const isMinPayMatch =
                userPreference.minPay > job.salaryRange.starting ||
                userPreference.minPay < job.salaryRange.ending;

            // Check if job deadline is valid (greater than current date)
            const currentDateTime = new Date();
            const jobDeadline = new Date(job.deadline);

            return (
                isTitleMatch ||
                isTypeMatch ||
                isMinPayMatch ||
                jobDeadline > currentDateTime
            );
        });
    }

    return jobsFilteredByPreferences.length > 0
        ? jobsFilteredByPreferences
        : jobsNotApplied;
};

const getJob = asyncHandler(async (req, res) => {
    const jobId = req.query.jobId;
    const userId = req.query.userId;


    // Retrieve saved job IDs for the user
    const savedJobs = await SavedJobs.findOne({ userId });
    const savedJobIds = savedJobs ? savedJobs.savedItems : [];

    // Retrieve the job based on jobId
    const jobFind = await Jobs.aggregate([
        {
            $match: { _id: new ObjectId(jobId) }
        },
        {
            $lookup: {
                from: 'jobquestions',
                localField: '_id',
                foreignField: 'jobId',
                as: 'questions'
            }
        }
    ])


    // Check if the job is saved for the user
    const isSaved = savedJobIds.includes(jobId.toString());

    // Create a response object with job details and save status
    const job = {
        ...jobFind[0],
        isSaved: isSaved,
    };

    res.json(job);


});

const SearchJob = asyncHandler(async (req, res) => {
    const searchQuery = req.query.searchQuery;
    const locationQuery = req.query.locationQuery;
    const userId = req.query.userId; // Assuming you have the userId available

    const currentDateTime = new Date();

    // Create a regex for case-insensitive partial matching on location
    const locationRegex = new RegExp(locationQuery, 'i');
    const searchReg = new RegExp(searchQuery, 'i')

    let jobs

    if (searchQuery.length === 0 || locationQuery.length === 0) {
        jobs = await Jobs.find({
            $and: [
                { deadline: { $gt: currentDateTime } }, // Check if the job is not expired
                {
                    $and: [
                        { jobRole: { $regex: searchReg } }, // Exact, case-sensitive match for jobRole
                        { location: { $regex: locationRegex } }, // Case-insensitive partial match for location
                    ],
                },
            ],
        }).sort({ createdAt: -1 });
    }
    else if (searchQuery.length === 0 && locationQuery.length === 0) {
        jobs = await Jobs.find({
            $and: [
                { deadline: { $gt: currentDateTime } }, // Check if the job is not expired,
            ],
        }).sort({ createdAt: -1 });
    }
    else {
        jobs = await Jobs.find({
            $and: [
                { deadline: { $gt: currentDateTime } }, // Check if the job is not expired
                {
                    $or: [
                        { jobRole: { $regex: searchReg } }, // Exact, case-sensitive match for jobRole
                        { location: { $regex: locationRegex } }, // Case-insensitive partial match for location
                    ],
                },
            ],
        }).sort({ createdAt: -1 });
    }

    const appliedJobIds = (await jobApplications.find({ userId }).distinct("jobId")).map(id => id.toString());

    // Filter out jobs that the user has applied for
    const jobsNotApplied = jobs.filter(
        (job) => !appliedJobIds.includes(job._id.toString())
    );

    // Additional filter to exclude applied jobs
    const jobsNotAppliedAndNotSaved = jobsNotApplied.filter(
        (job) => !appliedJobIds.includes(job._id.toString())
    );

    // Fetch user's saved jobs
    const savedJobs = await SavedJobs.findOne({ userId }).then((savedJobs) =>
        savedJobs ? savedJobs.savedItems : []
    );

    // Add isSaved field to each job
    const jobsWithIsSaved = jobsNotAppliedAndNotSaved.map((job) => {
        return {
            ...job._doc,
            isSaved: savedJobs.includes(job._id.toString()),
        };
    });

    return res.json({ jobs: jobsWithIsSaved });
});



const applyJob = asyncHandler((async (req, res) => {
    const { jobId, userId, questionReply } = req.body
    const company = req.body?.company
    const title = req.body?.title

    // Now you can log or send userAnswersString to the backend



    const resume = req.file && req.file.filename;

    const experience = {
        company: company,
        jobTitle: title
    }

    const applied = await jobApplications.create({
        jobId,
        userId,
        questionReply,
        resume,
    })

    if (applied) {
        const updateJob = await Jobs.findByIdAndUpdate({ _id: jobId }, { $inc: { applicationCount: '1' } })
        res.json(applied)
    }
    else {
        res.status(400)
        throw new Error('failed to apply')
    }

}))


export { listJobs, saveJob, unsaveJob, getJob, SearchJob, applyJob };
