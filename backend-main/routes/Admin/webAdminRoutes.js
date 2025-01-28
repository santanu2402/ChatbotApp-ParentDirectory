import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import cors from 'cors';

import UserAuth from '../../mongodb/models/User/userAuthModel.js'
import UserExtraInf from '../../mongodb/models/User/userExtraInfModel.js'
import UserDeviceInfo from '../../mongodb/models/Device/userDeviceInfoModel.js';
import UserActivity from '../../mongodb/models/Activity/userActivityModel.js';
import UserAddrInf from '../../mongodb/models/User/userAddInfModel.js';
import UserSavedList from '../../mongodb/models/User/userSavedListModel.js';
import UserAnalytics from '../../mongodb/models/Analytics/userAnalyticsModel.js';
import UserRecentlyViewed from '../../mongodb/models/User/userRecentlyViewedModel.js';
import UserSearchHistory from '../../mongodb/models/User/userSearchHistoryModel.js';
import UserAppNotification from '../../mongodb/models/Notification/userAppNotificationModel.js';
import UserOfflineMovieDetails from '../../mongodb/models/Movie/userOfflineMovieDetialsModel.js';
import UserOfflineImageList from '../../mongodb/models/Images/userOfflineImageListModel.js';
import UserFeedback from '../../mongodb/models/Feedbacks/userFeedbackModel.js';
import UserReport from '../../mongodb/models/Reports/userReportModel.js';
import AdminReportReply from '../../mongodb/models/Admin/adminReportReplyModel.js';
import AdminActivity from '../../mongodb/models/Activity/adminActivityModel.js';

import fetchadmin from '../../middleware/fetchAdmin.js';

const router = express.Router();
router.use(cors());

//Verify an admin AW1
router.get('/verify', [body('email', 'Enter a valid email').isEmail()], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password, adminName } = req.body;

        const adminProfile = await UserAuth.findOne({ email });
        if (!adminProfile) {
            return res.status(400).json({ success: false, message: 'No Such Admin Found.' });
        }

        const passwordCompare = await bcrypt.compare(password, adminProfile.password);
        if (!passwordCompare) {
            return res.status(400).json({ success: false, error: 'Enter Correct Details' });
        }

        const data = {
            info: {
                id: adminProfile._id
            }
        };

        const authToken = jwt.sign(data, process.env.JWT_SECRET);

        const AdminActivity = new AdminActivity({
            adminName: adminName,
            activityName: `Web-Admin-Verification`,
            user: adminProfile._id
        });
        await AdminActivity.save();

        res.status(201).json({ success: true, message: 'Verification Successful', authToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Verification Failed' });
    }
});

// Get Features Usage AW3
router.get('/features/analytics', async (req, res) => {
    try {
        const userId = req.query.userId;

        // Retrieve feature usage data from the database
        const featureUsage = await UserAnalytics.findOne({ user: userId });

        if (!featureUsage) {
            return res.status(404).json({ success: false, message: 'Feature usage data not found' });
        }

        // Calculate totalList
        const totalList = featureUsage.favlistCounter + featureUsage.alreadyWatchlistCounter + featureUsage.watchlistCounter;

        // Prepare response object
        const features = {
            sharingCounter: featureUsage.sharingCounter,
            ratingSubmittedCounter: featureUsage.ratingSubmittedCounter,
            searchCounter: featureUsage.searchCounter,
            moviePageVisitCounter: featureUsage.moviePageVisitCounter,
            favlistCounter: featureUsage.favlistCounter,
            alreadyWatchlistCounter: featureUsage.alreadyWatchlistCounter,
            watchlistCounter: featureUsage.watchlistCounter,
            totalList: totalList
        };

        res.status(200).json({ success: true, data: features });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch feature usage data' });
    }
});

// Get Feedback Analytics AW4
router.get('/feedback/analytics/get', async (req, res) => {
    try {
        // Get total number of feedbacks
        const totalFeedbacks = await UserFeedback.countDocuments();

        // Get number of feedbacks with published status true
        const publishedFeedbacks = await UserFeedback.countDocuments({ publishedStatus: true });

        res.status(200).json({ success: true, totalFeedbacks, publishedFeedbacks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch feedback analytics' });
    }
});

// Get Report Analytics AW5
router.get('/report/analytics/get', async (req, res) => {
    try {
        // Get total number of reports
        const totalReports = await UserReport.countDocuments();

        // Get number of reports with status "Resolved"
        const resolvedReports = await UserReport.countDocuments({ status: 'Resolved' });

        // Get number of reports with status "Received"
        const receivedReports = await UserReport.countDocuments({ status: 'Received' });

        // Get number of reports with status "Seen"
        const seenReports = await UserReport.countDocuments({ status: 'Seen' });

        // Get number of reports with status "Ongoing"
        const ongoingReports = await UserReport.countDocuments({ status: 'Ongoing' });

        res.status(200).json({ success: true, totalReports, resolvedReports, receivedReports, seenReports, ongoingReports });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch report analytics' });
    }
});

// All Users Report, Search by report id or user email and also filter status==received/seen/ongoing/resolved AW6
router.get('/report/get', async (req, res) => {
    try {
        const operation = req.query.operation; // either search or filter //if nothing then show all report of all users but sort by descending with created date that is the one which is created last will be at first
        let reports;

        if (operation === 'search') {
            const keyword = req.query.keyword;

            // Search by report id or user email
            reports = await UserReport.find({
                $or: [
                    { _id: keyword },
                    { user: { $in: await UserAuth.find({ email: keyword }).distinct('_id') } }
                ]
            }).sort({ createdAt: -1 });
        } else if (operation === 'filter') {
            const option = req.query.option;

            // Filter by status
            reports = await UserReport.find({ status: option }).sort({ createdAt: -1 });
        } else {
            // Show all reports of all users sorted by descending created date
            reports = await UserReport.find().sort({ createdAt: -1 });
        }

        res.status(200).json({ success: true, data: reports });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch reports' });
    }
});

// All Users Feedback, Search by feedback id or user email and also filter publishedStatus==published/unpublished AW7
router.get('/feedback/get', async (req, res) => {
    try {
        const operation = req.query.operation; // either search or filter //if nothing then show all feedback of all users but sort by descending with created date that is the one which is created last will be at first
        let feedbacks;

        if (operation === 'search') {
            const keyword = req.query.keyword;

            // Search by feedback id or user email
            feedbacks = await UserFeedback.find({
                $or: [
                    { _id: keyword },
                    { user: { $in: await UserAuth.find({ email: keyword }).distinct('_id') } }
                ]
            }).sort({ createdAt: -1 });
        } else if (operation === 'filter') {
            const option = req.query.option;

            // Filter by publishedStatus
            feedbacks = await UserFeedback.find({ publishedStatus: option === 'published' }).sort({ createdAt: -1 });
        } else {
            // Show all feedback of all users sorted by descending created date
            feedbacks = await UserFeedback.find().sort({ createdAt: -1 });
        }

        res.status(200).json({ success: true, data: feedbacks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch feedbacks' });
    }
});

// Get all admin activity sorted by asc createdAt and also filter by name AW8
router.get('/adminactivity/get', async (req, res) => {
    try {
        const name = req.query.name;

        let activities;
        if (!name) {
            // If no filter given, show all activities sorted by ascending createdAt
            activities = await AdminActivity.find().sort({ createdAt: 1 });
        } else {
            // Show only activities related to the given name sorted in ascending order
            activities = await AdminActivity.find({ adminName: name }).sort({ createdAt: 1 });
        }

        res.status(200).json({ success: true, data: activities });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch admin activities' });
    }
});

// Get all user activity sorted by asc createdAt
router.get('/useractivity/get', async (req, res) => {
    try {
        const userId = req.query.userId;

        // Find all user activities sorted by createdAt in ascending order
        const activities = await UserActivity.find({ user: userId }).sort({ createdAt: 'asc' });

        res.status(200).json({ success: true, data: activities });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get user activities' });
    }
});

//Get all user information including useranalytics AW9
router.get('/userinfo/get', fetchadmin, async (req, res) => {
    try {
        const userId = req.query.userId;
        const adminId = req.admin.id;
        const { adminName } = req.body;

        // Fetch all details of UserAddInfo and populate it to get User email but select(-password)
        const userInfo = await UserAddrInf.findOne({ user: userId }).select('-createdAt');
        const userAnalytics = await UserAnalytics.findOne({ user: userId }).select('-createdAt');

        // Fetch UserAuth details to get the email
        const userAuth = await UserAuth.findById(userId).select('-password');

        const newAdminActivity = new AdminActivity({
            adminName: adminName,
            activityName: `${adminName}-Viewed-User-Profile-${userId}`,
            user: adminId._id
        });
        await newAdminActivity.save();

        res.status(200).json({
            success: true,
            data: {
                userAuth,
                userInfo,
                userAnalytics
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch user information' });
    }
});

//Delete User AW9
router.delete('/deactivate', fetchadmin, async (req, res) => {
    try {
        const userId = req.query.userId;
        const adminId = req.admin.id;
        const { adminName } = req.body;

        // Delete user data from UserAuth collection
        await UserAuth.deleteOne({ _id: userId });
        await UserExtraInf.deleteMany({ user: userId });
        await UserDeviceInfo.deleteMany({ user: userId });
        await UserActivity.deleteMany({ user: userId });
        await UserAddrInf.deleteMany({ user: userId });
        await UserSavedList.deleteMany({ user: userId });
        await UserAnalytics.deleteMany({ user: userId });
        await UserRecentlyViewed.deleteMany({ user: userId });
        await UserSearchHistory.deleteMany({ user: userId });
        await UserAppNotification.deleteMany({ user: userId });
        await UserOfflineMovieDetails.deleteMany({ user: userId });
        await UserOfflineImageList.deleteMany({ user: userId });
        await UserFeedback.deleteMany({ user: userId });
        await UserReport.deleteMany({ user: userId });
        await AdminReportReply.deleteMany({ user: userId });

        const newAdminActivity = new AdminActivity({
            adminName: adminName,
            activityName: `${adminName}-Deleted-User-${userId}`,
            user: adminId
        });
        await newAdminActivity.save();

        res.status(200).json({ success: true, message: 'User account deactivated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to deactivate user account' });
    }
});

//List Analytics AW15
router.get('/userlist/info', async (req, res) => {
    try {
        const userId = req.query.userId;

        // Total number of movies under user irrespective of listname from UserSavedList
        const totalMovies = await UserSavedList.countDocuments({ user: userId });

        // Total number of movies in favourites and their details
        const favourites = await UserSavedList.find({ user: userId, listName: 'favourites' });
        const favouritesTotal = favourites.length;
        const favouritesMovies = favourites.map(movie => ({ id: movie.movieId, title: movie.movieTitle }));

        // Total number of movies in AlreadyWatched and their details
        const alreadyWatched = await UserSavedList.find({ user: userId, listName: 'AlreadyWatched' });
        const alreadyWatchedTotal = alreadyWatched.length;
        const alreadyWatchedMovies = alreadyWatched.map(movie => ({ id: movie.movieId, title: movie.movieTitle }));

        // Total number of movies in WatchList and their details
        const watchList = await UserSavedList.find({ user: userId, listName: 'WatchList' });
        const watchListTotal = watchList.length;
        const watchListMovies = watchList.map(movie => ({ id: movie.movieId, title: movie.movieTitle }));

        res.status(200).json({
            success: true,
            data: {
                totalMovies,
                favourites: {
                    total: favouritesTotal,
                    movies: favouritesMovies
                },
                alreadywatched: {
                    total: alreadyWatchedTotal,
                    movies: alreadyWatchedMovies
                },
                watchlist: {
                    total: watchListTotal,
                    movies: watchListMovies
                }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch user list information' });
    }
});

//user respective feedbacks AW16
router.get('/userfeedback/info', async (req, res) => {
    try {
        const userId = req.query.userId;
        const option = req.query.option;

        let feedbacks;

        // If there's a filter option passed, apply the filter; otherwise, show all feedbacks under that user
        if (option === 'published' || option === 'unpublished') {
            feedbacks = await UserFeedback.find({ user: userId, publishedStatus: option }).sort({ createdAt: -1 });
        } else {
            feedbacks = await UserFeedback.find({ user: userId }).sort({ createdAt: -1 });
        }

        res.status(200).json({ success: true, data: feedbacks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch user feedbacks' });
    }
});

//user respective reports AW17
router.get('/userreports/info', async (req, res) => {
    try {
        const userId = req.query.userId;
        const option = req.query.option;

        let reports;

        // If there's a filter option passed, apply the filter; otherwise, show all reports under that user
        if (option === 'received' || option === 'seen' || option === 'ongoing' || option === 'resolved') {
            reports = await UserReport.find({ user: userId, status: option }).sort({ createdAt: -1 });
        } else {
            reports = await UserReport.find({ user: userId }).sort({ createdAt: -1 });
        }

        res.status(200).json({ success: true, data: reports });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch user reports' });
    }
});

//show report details with report id AW11
router.get('userreports/details', async (req, res) => {
    try {
        const reportId = req.query.reportId;

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

//delete report with report id AW11
router.delete('userreport/delete', fetchadmin, async (req, res) => {
    try {
        const reportId = req.query._id;
        const adminId = req.admin.id;
        const { adminName } = req.body;
        // Find the user report and delete it
        const deletedReport = await UserReport.findOneAndDelete({ _id: reportId });

        // If the report is not found
        if (!deletedReport) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        // Delete all associated admin report replies
        await AdminReportReply.deleteMany({ report: reportId });

        // Decrement the report counter in user analytics
        await UserAnalytics.findOneAndUpdate({ user: deletedReport.user }, { $inc: { reportCounter: -1 } });

        const newAdminActivity = new AdminActivity({
            adminName: adminName,
            activityName: `${adminName}-Deleted-Report-${reportId}`,
            user: adminId
        });
        await newAdminActivity.save();

        res.status(200).json({ success: true, message: 'Report and associated replies deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete report and associated replies' });
    }
});

//add admin reply
router.post('/userreport/adminreply/add', fetchadmin, async (req, res) => {
    try {
        const reportId = req.query._id;
        const adminId = req.admin.id;
        const { adminName, replyContent } = req.body;

        // Create a new admin reply
        const newAdminReply = new AdminReportReply({
            adminName,
            replyContent,
            report: reportId
        });

        // Save the admin reply to the database
        await newAdminReply.save();

        // Update the status of the user report to 'ongoing' depending on the current status
        const userReport = await UserReport.findById(reportId);
        if (userReport.status === 'seen'||userReport.status === 'received') {
            userReport.status = 'ongoing';
        }
        await userReport.save();

        const newAdminActivity = new AdminActivity({
            adminName: adminName,
            activityName: `${adminName}-Add-Report-Reply-${reportId}`,
            user: adminId
        });
        await newAdminActivity.save();

        res.status(201).json({ success: true, message: 'Admin reply added successfully', data: newAdminReply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to add admin reply' });
    }
});

//fetch user feedback details
router.get('/userfeedback/get', async (req, res) => {
    try {
        const feedId = req.query.feedId;

        // Fetch user feedback details by feedback ID
        const userFeedback = await UserFeedback.findById(feedId);

        if (!userFeedback) {
            return res.status(404).json({ success: false, message: 'User feedback not found' });
        }

        res.status(200).json({ success: true, data: userFeedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch user feedback details' });
    }
});

//add orderno and change status of user feedback
router.post('/userfeedback/change', fetchadmin, async (req, res) => {
    try {
        const adminId = req.admin.id;
        const feedId = req.query.feedId;
        const { adminName, orderNo, status } = req.body;

        // Fetch user feedback by feedback ID
        const userFeedback = await UserFeedback.findById(feedId);

        if (!userFeedback) {
            return res.status(404).json({ success: false, message: 'User feedback not found' });
        }

        // Update order number and status of user feedback
        userFeedback.orderNo = orderNo;
        userFeedback.publishedStatus = status;

        // If the feedback is published, update checkedByAdmin with adminName
        if (status === true) {
            userFeedback.checkedByAdmin = adminName;
        }

        // Save the updated user feedback
        await userFeedback.save();

        const newAdminActivity = new AdminActivity({
            adminName: adminName,
            activityName: `${adminName}-Feedback-Changed-${feedId}`,
            user: adminId
        });
        await newAdminActivity.save();
        res.status(200).json({ success: true, message: 'User feedback updated successfully', data: userFeedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update user feedback' });
    }
});

//delete feedback
router.delete('/userfeedback/change', fetchadmin, async (req, res) => {
    try {
        const adminId = req.admin.id;
        const feedId = req.query.feedId;
        const { adminName } = req.body;
        // Find the user feedback by ID and delete it
        const deletedFeedback = await UserFeedback.findByIdAndDelete(feedId);

        if (!deletedFeedback) {
            return res.status(404).json({ success: false, message: 'User feedback not found' });
        }

        // Find the user ID from the deleted feedback
        const userId = deletedFeedback.user;

        // Find user analytics and decrement feedback counter value
        const userAnalytics = await UserAnalytics.findOne({ user: userId });
        if (userAnalytics) {
            userAnalytics.feedbackCounter -= 1; // Decrement feedback counter
            await userAnalytics.save();
        }

        const newAdminActivity = new AdminActivity({
            adminName: adminName,
            activityName: `${adminName}-Deleted-Feedback-${feedId}`,
            user: adminId
        });
        await newAdminActivity.save();

        
        res.status(200).json({ success: true, message: 'User feedback deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete user feedback' });
    }
});

//search user
router.get('/user/search', fetchadmin, async (req, res) => {
    try {
        const adminId = req.admin.id;
        const keyword = req.query.keyword;
        const { adminName } = req.body;
        // Search for user by email or ObjectId
        let users;
        if (keyword) {
            // Search for user by email or ObjectId
            users = await UserAuth.find({
                $or: [
                    { email: keyword },
                    { _id: keyword }
                ]
            });
        } else {
            // If no keyword is provided, fetch all users
            users = await UserAuth.find();
        }


        const newAdminActivity = new AdminActivity({
            adminName: adminName,
            activityName: `${adminName}-User-Search`,
            user: adminId
        });
        await newAdminActivity.save();

        res.status(200).json({ success: true, data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to search for users' });
    }
});

//add report on behalf of user
router.post('/admin/add/report/behalfuser', fetchadmin, async (req, res) => {
    try {
        const adminId = req.admin.id;
        const { email, adminName, reportSubject, reportDescription, reportImageUrl } = req.body;

        // Find the user by email in UserAuth
        const user = await UserAuth.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Create a new report
        const newReport = new UserReport({
            reportSubject,
            reportDescription,
            reportImageUrl,
            user: user._id
        });

        // Save the report to the database
        await newReport.save();

        // Find user analytics and increment report counter value
        const userAnalytics = await UserAnalytics.findOne({ user: user._id });
        if (userAnalytics) {
            userAnalytics.reportCounter += 1;
            await userAnalytics.save();
        }

        
        const newAdminActivity = new AdminActivity({
            adminName: adminName,
            activityName: `${adminName}-Add-Report-On-Behalf-Of-User-${newReport._id}`,
            user: adminId
        });
        await newAdminActivity.save();

        res.status(201).json({ success: true, message: 'Report added successfully', data: newReport });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to add report' });
    }
});

export default router;