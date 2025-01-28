import express from 'express';
import cors from 'cors';

import UserAuth from '../../mongodb/models/User/userAuthModel.js';
import UserAnalytics from '../../mongodb/models/Analytics/userAnalyticsModel.js';
import WebpageAnalytics from '../../mongodb/models/Analytics/webpageAnalyticsModel.js'
import fetchuser from '../../middleware/fetchUser.js';


const router = express.Router();
router.use(cors());


// Get total number of app users
router.get('/totaluser', async (req, res) => {
    try {
        // Count the total number of documents in UserAuth collection
        const totalUsers = await UserAuth.countDocuments();

        res.status(200).json({ success: true, totalUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get total number of users' });
    }
});

// Update App Duration
router.put('/appduration/update', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { steps } = req.query;

        // Get the user's analytics
        const userAnalytics = await UserAnalytics.findOne({ user: userId });

        // Calculate new engagement duration by adding steps
        const newDuration = userAnalytics.engagementDuration + parseInt(steps);

        // Update engagement duration in user's analytics
        await UserAnalytics.findOneAndUpdate(
            { user: userId },
            { $set: { engagementDuration: newDuration } },
            { new: true }
        );

        res.status(200).json({ success: true, message: 'App duration updated successfully', newDuration });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update app duration' });
    }
});

// Get the app duration of a user
router.get('/appduration/user/get', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user's analytics
        const userAnalytics = await UserAnalytics.findOne({ user: userId });

        if (!userAnalytics) {
            return res.status(404).json({ success: false, message: 'User analytics not found' });
        }

        const engagementDuration = userAnalytics.engagementDuration;
        res.status(200).json({ success: true, engagementDuration });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get user engagement duration' });
    }
});

// Get the total app duration of all users
router.get('/appduration/gettotal', async (req, res) => {
    try {
        // Find all user analytics
        const allUserAnalytics = await UserAnalytics.find({}, 'engagementDuration');

        // Calculate total engagement duration
        const totalEngagementDuration = allUserAnalytics.reduce((total, analytics) => {
            return total + analytics.engagementDuration;
        }, 0);

        res.status(200).json({ success: true, totalEngagementDuration });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get total engagement duration' });
    }
});

// Get the number of webpage visitors and webpage duration
router.get('/web/get', async (req, res) => {
    try {
        // Find the webpage analytics data
        const analyticsData = await WebpageAnalytics.findOne();

        if (!analyticsData) {
            return res.status(404).json({ success: false, message: 'Webpage analytics data not found' });
        }

        const { visitorCounter, engagementDuration } = analyticsData;
        res.status(200).json({ success: true, visitorCounter, engagementDuration });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get webpage analytics data' });
    }
});

// Update the duration and visitor count
router.put('/web/update', async (req, res) => {
    try {
        const { steps } = req.query;

        // Find the webpage analytics data
        let analyticsData = await WebpageAnalytics.findOne();

        if (!analyticsData) {
            // Create new analytics data if not found
            analyticsData = new WebpageAnalytics();
        }

        // Increment visitor counter by 1
        analyticsData.visitorCounter += 1;

        // Increment engagement duration by steps
        analyticsData.engagementDuration += parseInt(steps);

        // Save the updated analytics data
        await analyticsData.save();

        res.status(200).json({ success: true, message: 'Webpage analytics data updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update webpage analytics data' });
    }
});

export default router;