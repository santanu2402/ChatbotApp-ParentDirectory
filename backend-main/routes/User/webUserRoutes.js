import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import cors from 'cors';

import UserAuth from '../../mongodb/models/User/userAuthModel.js'
import UserActivity from '../../mongodb/models/Activity/userActivityModel.js';
import UserAddrInf from '../../mongodb/models/User/userAddInfModel.js';
import UserAnalytics from '../../mongodb/models/Analytics/userAnalyticsModel.js';
import UserFeedback from '../../mongodb/models/Feedbacks/userFeedbackModel.js';
import UserReport from '../../mongodb/models/Reports/userReportModel.js';
import AdminReportReply from '../../mongodb/models/Admin/adminReportReplyModel.js';

import fetchuser from '../../middleware/fetchUser.js';

const router = express.Router();
router.use(cors());


// Fetch all published feedbacks sorted by orderNo UW1
router.get('/feedback/fetch/published/getall', async (req, res) => {
    try {
        // Find all published feedbacks sorted by orderNo and exclude checkedByAdmin field
        const publishedFeedbacks = await UserFeedback.find({ publishedStatus: true })
            .sort({ orderNo: 1 }) // Sort by ascending orderNo
            .select('-checkedByAdmin'); // Exclude checkedByAdmin field

        // Send the sorted feedbacks as response
        res.status(200).json({ success: true, data: publishedFeedbacks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch published feedbacks' });
    }
});

//Verify An User UW4
router.post('/verifyuser', [body('email', 'Enter a valid email').isEmail()], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        const userProfile = await UserAuth.findOne({ email });
        if (!userProfile) {
            return res.status(400).json({ success: false, message: 'No Such User Found.' });
        }

        const passwordCompare = await bcrypt.compare(password, userProfile.password);
        if (!passwordCompare) {
            return res.status(400).json({ success: false, error: 'Enter Correct Details' });
        }

        const data = {
            info: {
                id: userProfile._id
            }
        };

        const authToken = jwt.sign(data, process.env.JWT_SECRET);

        const userActivity = new UserActivity({
            activityName: `Web-Verification`,
            user: userProfile._id
        });
        await userActivity.save();

        res.status(201).json({ success: true, message: 'Verification Successful', authToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Verification Failed' });
    }
});

//Fetch All User Details for Web UW2
router.get('/userdetails/get', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all user details by populating the UserAuth reference in UserAddrInf
        const userDetails1 = await UserAddrInf.findOne({ user: userId })
            .populate('user', '-password -termsAndCond -key -rstPswrdQnA'); // Excluding sensitive fields

        const userDetails2 = await UserAnalytics.findOne({ user: userId })
        if (!userDetails1) {
            return res.status(404).json({ success: false, message: 'User details not found' });
        }
        const userDetails3 = await UserActivity.find({ user: userId })
        if (!userDetails3) {
            return res.status(404).json({ success: false, message: 'User details not found' });
        }

        const data = [userDetails1, userDetails2,userDetails3];
        res.status(200).json({ success: true,message: 'User detail found', data: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch user details' });
    }
});

//Create Feedback UW6
router.post('/userfeedback/create', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { anonymous, feedback } = req.body;

        // Create feedback document
        const userFeedback = new UserFeedback({
            feedback: feedback,
            anonymous: anonymous,
            user: userId
        });

        // Save the feedback
        await userFeedback.save();

        // Increment the feedback counter in user analytics
        await UserAnalytics.findOneAndUpdate({ user: userId }, { $inc: { feedbackCounter: 1 } });

        const userActivity = new UserActivity({
            activityName: `Feedback-Created-${userFeedback._id}`,
            user: userId
        });
        await userActivity.save();

        res.status(201).json({ success: true, message: 'Feedback created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to create feedback' });
    }
});

// Fetch All Feedbacks UW5
router.get('/userfeedbacks/getall', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all feedbacks with specified fields and sort by creation date
        const feedbacks = await UserFeedback.find({ user: userId })
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .select('_id feedback publishedStatus anonymous createdAt'); // Select specific fields

        res.status(200).json({ success: true, data: feedbacks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch feedbacks' });
    }
});

// View Specific Feedback UW7
router.get('/userfeedbacks/get', async (req, res) => {
    try {
        const _id = req.query._id;
        
        // Find the feedback by _id
        const feedback = await UserFeedback.findById(_id);
        
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }
        
        res.status(200).json({ success: true, data: feedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
    }
});

// Delete User Feedback UW7
router.delete('/userfeedbacks/delete', async (req, res) => {
    try {
        const _id = req.query._id;

        // Find the feedback by ID and delete it
        const deletedFeedback = await UserFeedback.findByIdAndDelete(_id);

        if (!deletedFeedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        // Decrement the feedback counter in user analytics
        const userId = deletedFeedback.user;
        await UserAnalytics.findOneAndUpdate({ user: userId }, { $inc: { feedbackCounter: -1 } });

        const userActivity = new UserActivity({
            activityName: `Feedback-Deleted-${_id}`,
            user: userId
        });
        await userActivity.save();

        res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete feedback' });
    }
});

// Create a Report UW9
router.post('/userreport/create', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { reportSubject, reportDescription, reportImageUrl } = req.body;

        // Create a new report
        const newReport = new UserReport({
            reportSubject,
            reportDescription,
            reportImageUrl,
            user: userId
        });

        // Save the report to the database
        await newReport.save();

        // Increment the report counter in user analytics
        await UserAnalytics.findOneAndUpdate({ user: userId }, { $inc: { reportCounter: 1 } });

        const userActivity = new UserActivity({
            activityName: `Report-Created-${newReport._id}`,
            user: userId
        });
        await userActivity.save();

        res.status(201).json({ success: true, message: 'Report created successfully', data: newReport });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to create report' });
    }
});

// Fetch All Reports UW6
router.get('/userreports/getall', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all reports of the user
        const userReports = await UserReport.find({ user: userId });

        // Extract specific fields from each report
        const reportsData = userReports.map(report => ({
            _id: report._id,
            reportSubject: report.reportSubject,
            status: report.status,
            createdAt: report.createdAt
        }));

        res.status(200).json({ success: true, data: reportsData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch reports' });
    }
});

// View Specific Report UW8
router.get('/userreport/get', async (req, res) => {
    try {
        const reportId = req.query._id;
        
        // Find the report by its ID
        const report = await UserReport.findById(reportId);

        // If the report is not found
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        // Fetch any replies associated with the report
        const replies = await AdminReportReply.find({ report: reportId });

        // Extract specific fields from the report
        const reportData = {
            _id: report._id,
            reportSubject: report.reportSubject,
            reportDescription: report.reportDescription,
            reportImageUrl: report.reportImageUrl,
            status: report.status,
            resolvedByAdmin: report.resolvedByAdmin,
            createdAt: report.createdAt,
            replies: replies.map(reply => ({
                adminName: reply.adminName,
                replyDescription: reply.replyDescription,
                createdAt: reply.createdAt
            }))
        };

        res.status(200).json({ success: true, data: reportData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch report' });
    }
});

// Delete User Report and all respected admin replies UW8
router.delete('/userreport/delete', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const reportId = req.query._id;

        // Find the user report and delete it
        const deletedReport = await UserReport.findOneAndDelete({ _id: reportId, user: userId });

        // If the report is not found
        if (!deletedReport) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        // Delete all associated admin report replies
        await AdminReportReply.deleteMany({ report: reportId });

        // Decrement the report counter in user analytics
        await UserAnalytics.findOneAndUpdate({ user: userId }, { $inc: { reportCounter: -1 } });

        const userActivity = new UserActivity({
            activityName: `Report-Deleted-${reportId}`,
            user: userId
        });
        await userActivity.save();

        res.status(200).json({ success: true, message: 'Report and associated replies deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete report and associated replies' });
    }
});

export default router;