import asyncHandler from 'express-async-handler'
import recruitergenerateToken from '../Utils/recruiterGenerateToken.js'
import OTP from '../Models/otpModel.js'
import nodeMailer from 'nodemailer'
import generateOtp from 'generate-otp'

import Users from '../Models/userModel.js'
import Industries from '../Models/industriesModel.js'
import Skills from '../Models/skillsModel.js'
import Jobs from '../Models/jobsModel.js'
import jobApplications from '../Models/applicationModel.js'
import Connections from '../Models/connestionsModel.js'

import mongoose from 'mongoose'
const { ObjectId } = mongoose.Types

const recruiterAuth = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const findRecruiter = await Users.findOne({ email: email })

    if (!findRecruiter) {
        res.status(400);
        throw new Error("email does't exist");
    }

    if (findRecruiter.isBlocked) {
        res.status(400)
        throw new Error("you are blocked by admin");
    }

    if (!findRecruiter.isAccepted) {
        res.status(400)
        throw new Error('Wait..your profile is not accepted by Admin')
    }

    if (findRecruiter && (await findRecruiter.matchPassword(password))) {
        recruitergenerateToken(res, findRecruiter._id);

        res.status(200).json({
            _id: findRecruiter._id,
            firstName: findRecruiter.firstName,
            lastName: findRecruiter.lastName,
            email: findRecruiter.email,
            mobile: findRecruiter.mobile,
            image: findRecruiter.profileImg,
        });
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }

})

const registerRecruiter = asyncHandler(async (req, res) => {

    const { email, mobile } = req.body

    const findEmail = await Users.findOne({ email })
    if (findEmail) {
        res.status(400)
        throw new Error('Email already exists')
    }
    const findMobile = await Users.findOne({ mobile })
    if (findMobile) {
        res.status(400)
        throw new Error('mobile number already in use')
    }


    const otp = generateOtp.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
    });

    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "OTP for Verification",
        text: `Your OTP for verification is: ${otp}`,
    };

    try {
        await OTP.create({ email, otp });
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
})

const verifyRecruiter = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, mobile, title, password, companyName, industryType, gender, otp, location, education } = req.body
    const images = req.file && req.file.filename;


    const otpDocument = await OTP.findOne({ email, otp });


    if (!otpDocument) {
        res.status(400)
        throw new Error('invalid OTP')
    }

    const findEmail = await Users.find({ email: email })
    const findNum = await Users.find({ mobile: mobile })

    if (findEmail.length > 0) {
        res.status(400)
        throw new Error('email already existing')
    }
    if (findNum.length > 0) {
        res.status(400)
        throw new Error('Mobile Number already existing')
    }

    const recruiter = await Users.create({
        firstName,
        lastName,
        email,
        mobile,
        companyName,
        title,
        industryType,
        location,
        gender,
        education,
        profileImg: images,
        isAccepted: false,
        roles: ['recruiter'],
        password,
    });
    if (recruiter) {
        res.status(201).json({
            _id: recruiter._id,
            firstName: recruiter.firstName,
            email: recruiter.email,
            lastName: recruiter.lastName,
            mobile: recruiter.mobile,
        });
    } else {
        res.status(400);
        throw new Error("Invalid recruiter data");
    }
})

const recruiterforgotPassVerify = asyncHandler(async (req, res) => {
    const email = req.query.email
    const isExisting = await Users.findOne({ $and: [{ email: email }, { roles: 'recruiter' }] })
    if (!isExisting) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = generateOtp.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
    });

    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "OTP for Verification",
        text: `Your OTP for verification is: ${otp}`,
    };

    try {
        await OTP.create({ email, otp });
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
})

const recruiterverifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpDocument = await OTP.findOne({ email, otp });

        if (!otpDocument) {
            return res.status(500).json({ status: false, message: "Invalid OTP" });
        }
        else {
            res.status(200).json({ status: true })
        }
    } catch (error) {
        console.error("Error updating password:", error);
        res
            .status(500)
            .json({ status: false, message: "Failed to update password" });
    }
});

const recruiterAddnewPassword = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });

    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }

    user.password = password;
    await user.save();

    res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
})

//get industries
const listIndustries = asyncHandler(async (req, res) => {
    const industries = await Industries.find()
    res.status(201).json({ data: industries })
})


const listSkills = asyncHandler(async (req, res) => {
    const skills = await Skills.find({ isListed: true })
    res.status(201).json({ data: skills })
})




const listJobs = asyncHandler(async (req, res) => {
    const recruiterId = req.query.recruiterId;

    const jobsWithApplications = await Jobs.aggregate([
        {
            $match: { recruiterId: new mongoose.Types.ObjectId(recruiterId) }
        },
        {
            $lookup: {
                from: "jobApplications", // Replace with the actual name of your Applications collection
                localField: "_id",
                foreignField: "jobId",
                as: "applications"
            }
        }
    ]);


    res.status(201).json({ data: jobsWithApplications });
});

const searchJob = asyncHandler(async (req, res) => {
    const searchTerm = req.query.searchTerm;


    const searchResults = await Jobs.find({
        $or: [
            { jobRole: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive regex match for jobRole
            { jobType: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive regex match for jobType
            { location: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive regex match for location
        ],
    });

    res.json(searchResults);
});

const filterJobByLocation = asyncHandler(async (req, res) => {
    const recruiterId = req.recruiter._id
    const location = req.query.location
    const searchResults = await Jobs.find({ $and: [{ recruiterId: recruiterId }, { location: location }] })
    res.json(searchResults)
})

const recruiterloadMyProfile = asyncHandler(async (req, res) => {
    const recruiterId = req.query.recruiterId;


    const data = await Users.aggregate([
        {
            $match: {
                _id: new ObjectId(recruiterId)
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
                firstName: 1,
                lastName: 1,
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

    const followers = await Connections.find({ userId: recruiterId })

    res.status(201).json({ data: data[0], followers: followers });
});



const recruiterEditProfile = asyncHandler(async (req, res) => {
    const recruiterId = req.body.recruiterId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const location = req.body.location;
    const companyName = req.body.companyName;
    const title = req.body.title;

    const images = req.file && req.file.filename;


    const recruiter = await Users.findOneAndUpdate(
        { _id: recruiterId },
        {
            firstName: firstName,
            lastName: lastName,
            companyName: companyName,
            title: title,
            location: location,
            profileImg: images,
        },
        { new: true } // Use { new: true } to return the updated document
    );

    if (recruiter) {
        res.json({
            data: {
                _id: recruiter._id,
                firstName: recruiter.firstName,
                lastName: recruiter.lastName,
                title: recruiter.title,
                email: recruiter.email,
                mobile: recruiter.mobile,
                image: recruiter.profileImg,
            },
            status: true
        });
    } else {
        res.status(404).json({ error: { message: 'User not found' } });
    }

})

const recruiterchangePassword = asyncHandler(async (req, res) => {
    const oldPass = req.query.oldPass
    const newPass = req.query.newPass
    const userId = req.recruiter._id; // Assuming you have middleware to extract user information from the request
    // Fetch user by ID
    const user = await Users.findById(userId);

    // Check if the user exists
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if the old password is correct
    const isPasswordMatch = await user.matchPassword(oldPass);


    if (!isPasswordMatch) {
        return res.status(400).json({ success: false, message: 'Old password is incorrect' });
    }

    // Set the new password and save the user
    user.password = newPass;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
})

const logoutRecruiter = asyncHandler(async (req, res) => {

    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });

});



export {
    recruiterAuth,
    registerRecruiter,
    verifyRecruiter,
    recruiterforgotPassVerify,
    recruiterAddnewPassword,
    recruiterverifyOtp,
    listIndustries,
    listSkills,
    listJobs,
    searchJob,
    filterJobByLocation,
    recruiterloadMyProfile,
    recruiterEditProfile,
    recruiterchangePassword,
    logoutRecruiter
}