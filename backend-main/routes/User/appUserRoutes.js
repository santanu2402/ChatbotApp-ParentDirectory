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
import chatbotLink from '../../mongodb/models/ChatBotLinkModel.js';
import RecommendationLink from '../../mongodb/models/RecommendationLinkModel.js'
import fetchuser from '../../middleware/fetchUser.js';

const router = express.Router();
router.use(cors());

//Fetch And Store In Offline DB
router.get('/offlinefetch', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user details from UserAddrInf collection
        const userDetails = await UserAddrInf.findOne({ user: userId })
            .populate('user', '-password -termsAndCond -key -rstPswrdQnA');

        // Fetch user extra info from userExtraInf collection
        const userExtra = await UserExtraInf.findOne({ user: userId });

        // Fetch user's recently viewed movie from UserRecentlyViewed collection
        const userRecent = await UserRecentlyViewed.find({ user: userId });

        // Fetch user's saved list from UserSavedList collection
        const userSaved = await UserSavedList.find({ user: userId });

        // Fetch user's search history from UserSearchHistory collection
        const userSearch = await UserSearchHistory.find({ user: userId });

        // Fetch user's app notification from UserAppNotification collection
        const userNotification = await UserAppNotification.find({ user: userId });

        // Fetch user's offline image list from UserOfflineImageList collection
        const userOfflineImage = await UserOfflineImageList.find({ user: userId });

        // Fetch user's offline movie details from UserOfflineMovieDetails collection
        const userOfflineMovie = await UserOfflineMovieDetails.find({ user: userId });

        // Store fetched data in an array of objects
        const offlineData = [
            userDetails,
            userExtra,
            userRecent,
            userSaved,
            userSearch,
            userNotification,
            userOfflineImage,
            userOfflineMovie
        ];

        // Send the array of objects as response
        res.status(200).json({ success: true, data: offlineData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch offline data' });
    }
});

// Fetch Notification
router.get('/notification/get', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Retrieve notifications for the user
        const userNotifications = await UserAppNotification.findOne({ user: userId });

        // Check if notifications are found
        if (!userNotifications) {
            return res.status(404).json({ success: false, message: 'Notifications not found for this user' });
        }

        // Send the notifications as a response
        res.status(200).json({ success: true, userNotifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
});

// Add Notification
router.post('/notification/add', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId, movieTitle, movieGroup,imageUrl } = req.body;


        // Retrieve the user's notifications
        let userNotifications = await UserAppNotification.findOne({ user: userId, movieId: movieId, movieGroup: movieGroup });
        // If user notifications do not exist, create a new entry
        if (!userNotifications) {
            userNotifications = new UserAppNotification({ movieId: movieId, movieTitle:movieTitle, movieGroup: movieGroup,imageUrl:imageUrl, user: userId });
            await userNotifications.save();
        }
        // Send the updated notification array as response
        res.status(200).json({ success: true, message: 'Notification added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to add notification' });
    }
});

// Add Notification
router.post('/notification/search', fetchuser, async (req, res) => {
    try {
        console.log('inside search notifi')
        const userId = req.user.id;
        const { movieId, movieGroup } = req.body;
        console.log(movieId,movieGroup)
        let userNotifications = await UserAppNotification.findOne({ user: userId, movieId: movieId, movieGroup: movieGroup });
        console.log(userNotifications)
        if (userNotifications) {
            console.log('true found')
            res.status(200).json({ success: true, message: 'found' });
        }else{
            console.log('false not found')
            res.status(200).json({ success: true, message: 'notfound' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to search notification' });
    }
});

//common User Analytics Increment
router.post('/useranalytics/increment', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const keyToBeUpdated = req.query.key;

        // Define the attributes to be incremented
        const attributesToIncrement = ['searchCounter', 'ratingSubmittedCounter', 'sharingCounter', 'feedbackCounter', 'reportCounter', 'moviePageVisitCounter'];

        // Check if the key to be updated is one of the specified attributes
        if (!attributesToIncrement.includes(keyToBeUpdated) && keyToBeUpdated !== 'engagementDuration') {
            return res.status(400).json({ success: false, message: 'Invalid key to be updated' });
        }

        let updateQuery;
        if (keyToBeUpdated === 'engagementDuration') {
            const steps = parseInt(req.query.steps);
            updateQuery = { $inc: { [keyToBeUpdated]: steps } };
        } else {
            // Construct the update query
            updateQuery = { $inc: { [keyToBeUpdated]: 1 } };
        }

        // Find and update the user analytics document
        const userAnalytics = await UserAnalytics.findOneAndUpdate({ user: userId }, updateQuery, { new: true });

        if (!userAnalytics) {
            return res.status(404).json({ success: false, message: 'User analytics not found' });
        }

        res.status(200).json({ success: true, message: 'User analytics updated successfully', data: userAnalytics });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update user analytics' });
    }
});

//get common User Analytics
router.get('/useranalytics/get', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const keyToRetrieve = req.query.key;

        // Define the attributes to be retrieved
        const attributesToRetrieve = ['searchCounter', 'ratingSubmittedCounter', 'sharingCounter', 'feedbackCounter', 'reportCounter', 'moviePageVisitCounter'];

        // Check if the key to retrieve is a valid attribute
        if (!attributesToRetrieve.includes(keyToRetrieve)) {
            return res.status(400).json({ success: false, message: 'Invalid key to retrieve' });
        }

        // Construct the projection object to select only the specified key
        const projection = { [keyToRetrieve]: 1 };

        // Retrieve the user analytics document with the selected key
        const userAnalytics = await UserAnalytics.findOne({ user: userId }, projection);

        if (!userAnalytics) {
            return res.status(404).json({ success: false, message: 'User analytics not found' });
        }

        res.status(200).json({ success: true, message: 'User analytics retrieved successfully', data: userAnalytics[keyToRetrieve] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to retrieve user analytics' });
    }
});

// Create  User A2 *checked*
router.post('/signup/create', [body('email', 'Enter a valid email').isEmail()], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password, termsAndCond, key, userdeviceinfo } = req.body;

        const existingUser = await UserAuth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserAuth({
            email,
            password: hashedPassword,
            termsAndCond,
            key
        });

        await newUser.save();

        const data = {
            info: {
                id: newUser._id
            }
        };

        const userExtraInf = new UserExtraInf({
            signInDone: true,
            user: newUser._id
        });

        await userExtraInf.save();

        const authToken = jwt.sign(data, process.env.JWT_SECRET);

        const { osType, andVersion, andSerial, andModel, andBrand, andManufacturer } = userdeviceinfo;
        const userDeviceInfo = new UserDeviceInfo({
            osType,
            andVersion,
            andSerial,
            andModel,
            andBrand,
            andManufacturer,
            user: newUser._id
        });
        await userDeviceInfo.save();


        const userActivity = new UserActivity({
            activityName: `SignUp`,
            user: newUser._id
        });
        await userActivity.save();

        const userAnalytics = new UserAnalytics({
            user: newUser._id
        });
        await userAnalytics.save();

        res.status(201).json({ success: true, message: 'User created successfully', authToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Profile Creation Failed' });
    }
});

//Add Additional Information A3 *checked*
router.post('/addinf/add', fetchuser, async (req, res) => {
    try {
        const { name, gender, dateOfBirth, profileImageUrl, langPref, genrePref, rstPswrdQnA } = req.body;
        const userId = req.user.id;

        const userAddrInf = new UserAddrInf({
            name,
            gender,
            dateOfBirth,
            profileImageUrl,
            langPref,
            genrePref,
            rstPswrdQnA,
            user: userId
        });
        await userAddrInf.save();

        if (profileImageUrl) {
            const newPicLink = new UserOfflineImageList({
                pictureId: `${userId}profile`,
                url: profileImageUrl,
                user: userId
            });
            await newPicLink.save();
        }


        await UserExtraInf.findOneAndUpdate({ user: userId }, { isAddInfoDone: true });

        const userActivity = new UserActivity({
            activityName: `Additional-Info-Added`,
            user: userId
        });
        await userActivity.save();

        res.status(201).json({ success: true, message: 'Additional information added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to add additional information' });
    }
});

//Update User Information
router.put('/user/update', fetchuser, async (req, res) => {
    try {

        const { name, gender, email, dateOfBirth, profileImageUrl, langPref, genrePref, chooseImage } = req.body;
        const userId = req.user.id;

        // Update email in UserAuth
        await UserAuth.findOneAndUpdate({ _id: userId }, { email: email });

        const resp = await UserAddrInf.findOne({ user: userId });
        console.log(resp)

        if (chooseImage) {
            await UserAddrInf.findOneAndUpdate({ user: userId }, {
                name: name,
                gender: gender,
                dateOfBirth: dateOfBirth,
                profileImageUrl: profileImageUrl,
                langPref: langPref,
                genrePref: genrePref,
                rstPswrdQnA: resp.rstPswrdQnA
            });
            await UserOfflineImageList.findOneAndUpdate({ user: userId }, { Url: profileImageUrl });
        }
        else {
            await UserAddrInf.findOneAndUpdate({ user: userId }, {
                name: name,
                gender: gender,
                dateOfBirth: dateOfBirth,
                profileImageUrl: resp.profileImageUrl,
                langPref: langPref,
                genrePref: genrePref,
                rstPswrdQnA: resp.rstPswrdQnA
            });
        }
        const userActivity = new UserActivity({
            activityName: `User-Updated`,
            user: userId
        });
        await userActivity.save();
        res.status(200).json({ success: true, message: 'User details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update user details' });
    }
});

// Login User A4 *checked*
router.post('/signin/verify', [body('email', 'Enter a valid email').isEmail()], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password, userdeviceinfo } = req.body;

        const userProfile = await UserAuth.findOne({ email });
        if (!userProfile) {
            return res.status(400).json({ success: false, message: 'No Such User Found, Create New Account.' });
        }

        const passwordCompare = await bcrypt.compare(password, userProfile.password);
        if (!passwordCompare) {
            return res.status(400).json({ success: false, error: 'Enter Correct Login Details' });
        }

        const data = {
            info: {
                id: userProfile._id
            }
        };

        const userExtraInf = new UserExtraInf({
            signInDone: true,
            user: userProfile._id
        });
        await userExtraInf.save();

        const authToken = jwt.sign(data, process.env.JWT_SECRET);

        if (userdeviceinfo) {
            const { ostype, ifAndroid, ifIos } = userdeviceinfo;
            let deviceInfo = null;

            if (ostype === 'android' && ifAndroid) {
                deviceInfo = {
                    osType: 'android',
                    ...ifAndroid,
                    user: newUser._id
                };
            } else if (ostype === 'ios' && ifIos) {
                deviceInfo = {
                    osType: 'ios',
                    ...ifIos,
                    user: newUser._id
                };
            }

            if (deviceInfo) {
                const userDeviceInfo = new UserDeviceInfo(deviceInfo);
                await userDeviceInfo.save();
            }
        }

        const userActivity = new UserActivity({
            activityName: `SignIn`,
            user: userProfile._id
        });
        await userActivity.save();

        res.status(201).json({ success: true, message: 'SignIn Successful', authToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'SignIn Failed' });
    }
});

//Find User Email Check User Answer and Change Password A5
//Find User Email FOrgot Password Part1 *checked*
router.post('/forgotpassword/findemail', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await UserAuth.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found with the given email address. Create a new account.' });
        }

        res.status(200).json({ success: true, message: 'Email verified' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to verify email. Please try again later.' });
    }
});
// Verify User Answer Part2 *checked*
router.post('/forgotpassword/verifyans', async (req, res) => {
    try {
        const { email, rstPswrdQnA } = req.body;

        const user = await UserAuth.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userAddrInf = await UserAddrInf.findOne({ user: user._id });

        if (!userAddrInf || userAddrInf.rstPswrdQnA !== rstPswrdQnA) {
            return res.status(500).json({ success: false, message: 'Wrong Answer! Sorry!!' });
        }

        res.status(200).json({ success: true, message: 'Answer Verified!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to Verify Answer, Please Check After Sometime.' });
    }
});
// Change Password Part3 *checked*
router.put('/forgotpassword/change', async (req, res) => {
    try {
        const { email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await UserAuth.findOneAndUpdate({ email: email }, { password: hashedPassword });

        if (user) {
            const userActivity = new UserActivity({
                activityName: `Forgot-Password-Changed`,
                user: user.id
            });
            await userActivity.save();
            res.status(200).json({ success: true, message: 'Password Changed Successfully' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Password Change Unsuccessful' });
    }
});

//Change Password A17
//Part1 verify old password *checked*
router.post('/changepassword/verifyold', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { password } = req.body;
        const userProfile = await UserAuth.findOne({ _id: userId });
        const passwordCompare = await bcrypt.compare(password, userProfile.password);
        if (!passwordCompare) {
            return res.status(400).json({ success: false, error: 'Wrong Old Password' });
        }
        return res.status(200).json({ success: true, error: 'Verified Old Password' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to verify old Password. Please try again later.' });
    }
});
//Part2 Change password *checked*
router.put('/changepassword/change', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await UserAuth.findOneAndUpdate({ _id: userId }, { password: hashedPassword });

        if (user) {
            const userActivity = new UserActivity({
                activityName: `Password-Changed`,
                user: user.id
            });
            await userActivity.save();
            res.status(200).json({ success: true, message: 'Password Changed Successfully' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Password Change Unsuccessful' });
    }
});

//To view  the saved list A7, A9
router.get('/savedlist/view', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const listname = req.query.listname;

        // Find the user's saved movie lists with the specified listname
        const savedLists = await UserSavedList.find({ user: userId, listName: listname });

        // If no saved lists found for the user with the specified listname
        if (!savedLists || savedLists.length === 0) {
            return res.status(404).json({ success: false, message: `No ${listname} found for the user` });
        }

        // Return the found saved lists
        return res.status(200).json({ success: true, message: `${listname} retrieved successfully`, data: savedLists });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Failed to retrieve saved lists' });
    }
});

//delete movie from savedlist with movie id and listname A7, A9
router.delete('/savedlist/delete', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const movieId = req.query.movieid;
        const listname = req.query.listname;

        // Find the movie in the user's saved list based on movieId and listname
        const movieToDelete = await UserSavedList.findOneAndDelete({ user: userId, movieId: movieId, listName: listname });

        // If the movie is not found in the user's saved list
        if (!movieToDelete) {
            return res.status(404).json({ success: false, message: 'Movie not found in the saved list' });
        }

        // Decrement the respective list counter in user analytics based on listname
        let userUpdate;
        if (listname === 'favourites') {
            userUpdate = await UserAnalytics.findOneAndUpdate({ user: userId }, { $inc: { favlistCounter: -1 } });
        } else if (listname === 'watchlist') {
            userUpdate = await UserAnalytics.findOneAndUpdate({ user: userId }, { $inc: { watchlistCounter: -1 } });
        } else {
            userUpdate = await UserAnalytics.findOneAndUpdate({ user: userId }, { $inc: { alreadyWatchlistCounter: -1 } });
        }

        // If the user update operation fails
        if (!userUpdate) {
            return res.status(500).json({ success: false, message: 'Failed to update user analytics' });
        }

        // If the movie is successfully deleted from the user's saved list and counters are decremented
        const userActivity = new UserActivity({
            activityName: `Movie-Deleted-Id${movieId}-list${listname}`,
            user: userId
        });
        await userActivity.save();

        return res.status(200).json({ success: true, message: 'Movie deleted from the saved list successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Failed to delete movie from the saved list' });
    }
});

// Delete all entries from UserSavedList A15
router.delete('/savedlist/alldelete', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete all entries from UserSavedList associated with the user
        await UserSavedList.deleteMany({ user: userId });

        // Reset all three counters to zero in user analytics
        await UserAnalytics.findOneAndUpdate({ user: userId }, { favlistCounter: 0, watchlistCounter: 0, alreadyWatchlistCounter: 0 });

        const userActivity = new UserActivity({
            activityName: `All-Movie-List-Deleted`,
            user: userId
        });
        await userActivity.save();

        res.status(200).json({ success: true, message: 'All entries deleted from the saved list successfully and counters reset to zero' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete entries from the saved list and reset counters' });
    }
});



//add movie to list A9
router.post('/savedlist/add', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId, movieTitle, movieImageLink, movieRating, movieOverview, movieReleasedDate, movieRuntime, movieCountryOfOrigin, movieLanguage, movieRevenue, movieDirector, movieProductionCompany, movieCast, movieGenre } = req.body;

        const listname = req.query.listname;

        // Check if the movie already exists in the UserSavedList
        const existingMovie = await UserSavedList.findOne({ user: userId, movieId, listName: listname });

        // If the movie already exists, return success without adding it again
        if (existingMovie) {
            return res.status(200).json({ success: true, message: 'Movie already exists in the list' });
        }

        // Create a new UserSavedList document to add the movie to the specified list
        const newList = new UserSavedList({
            movieId,
            movieTitle,
            listName: listname,
            user: userId
        });

        // Save the new UserSavedList document
        await newList.save();

        // Update the respective list counter in user analytics based on listname
        let userUpdate;
        if (listname === 'favourites') {
            userUpdate = await UserAnalytics.findOneAndUpdate({ user: userId }, { $inc: { favlistCounter: 1 } });
        } else if (listname === 'watchlist') {
            userUpdate = await UserAnalytics.findOneAndUpdate({ user: userId }, { $inc: { watchlistCounter: 1 } });
        } else {
            userUpdate = await UserAnalytics.findOneAndUpdate({ user: userId }, { $inc: { alreadyWatchlistCounter: 1 } });
        }

        // Check if the movie already exists in UserOfflineMovieDetails
        const existingOfflineMovie = await UserOfflineMovieDetails.findOne({ movieId });

        // If the movie does not exist in UserOfflineMovieDetails, create a new entry
        if (!existingOfflineMovie) {
            const newMovie = new UserOfflineMovieDetails({
                movieId,
                movieTitle,
                movieImageLink,
                movieRating,
                movieOverview,
                movieReleasedDate,
                movieRuntime,
                movieCountryOfOrigin,
                movieLanguage,
                movieRevenue,
                movieDirector,
                movieProductionCompany,
                movieCast,
                movieGenre,
                user: userId
            });
            await newMovie.save();
        }

        // Check if the picture already exists in UserOfflineImageList
        const existingPicLink = await UserOfflineImageList.findOne({ pictureId: movieId });

        // If the picture does not exist in UserOfflineImageList, create a new entry
        if (!existingPicLink) {
            const newPicLink = new UserOfflineImageList({
                pictureId: movieId,
                url: movieImageLink,
                user: userId
            });
            await newPicLink.save();
        }

        const userActivity = new UserActivity({
            activityName: `Movie-Added-To-List-${movieId}-${listname}`,
            user: userId
        });
        await userActivity.save();
        res.status(200).json({ success: true, message: 'Movie added to the list successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to add movie to the list' });
    }
});
//add Movie To Recently Viewed A9
router.post('/recentlyviewed/add', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId, movieTitle } = req.body;

        // Create a new document for the recently viewed movie
        const recentlyViewedMovie = new UserRecentlyViewed({
            movieId,
            movieTitle,
            user: userId
        });

        // Save the recently viewed movie to the database
        await recentlyViewedMovie.save();

        res.status(201).json({ success: true, message: 'Movie added to recently viewed list successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to add movie to recently viewed list' });
    }
});

//get all recently viewed movie list A8
router.get('/recentlyviewed/get', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Retrieve all recently viewed movies for the user in descending order of creation date
        const recentlyViewedMovies = await UserRecentlyViewed.find({ user: userId })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: recentlyViewedMovies });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get recently viewed movies' });
    }
});

// Delete all recently viewed list A15
router.delete('/recentlyviewed/delete', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete all recently viewed movies for the user
        await UserRecentlyViewed.deleteMany({ user: userId });
        const userActivity = new UserActivity({
            activityName: `Delete-All-Recently-Viewed-Movie`,
            user: userId
        });
        await userActivity.save();
        res.status(200).json({ success: true, message: 'Recently viewed list deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete recently viewed list' });
    }
});

// Add Search to Recently Searched A12
router.post('/recentlysearched/add', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const searchTitle = req.query.searchTitle;

        // Create a new document for the recently searched query
        const recentlySearchedQuery = new UserSearchHistory({
            searchTitle,
            user: userId
        });

        // Save the recently searched query to the database
        await recentlySearchedQuery.save();

        res.status(201).json({ success: true, message: 'Search query added to recently searched list successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to add search query to recently searched list' });
    }
});

// Get all recently searched queries A12
router.get('/recentlysearched/get', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Retrieve all recently searched queries for the user in descending order of creation date
        const recentlySearchedQueries = await UserSearchHistory.find({ user: userId })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: recentlySearchedQueries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get recently searched queries' });
    }
});

// Delete full recent searches list A15
router.delete('/recentlysearched/delete', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete all recent searches for the user
        await UserSearchHistory.deleteMany({ user: userId });
        const userActivity = new UserActivity({
            activityName: `Delete-All-Search-History`,
            user: userId
        });
        await userActivity.save();
        res.status(200).json({ success: true, message: 'Recent searches deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete recent searches' });
    }
});

//fetch all user details A12
router.get('/userdetails/get', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all user details by populating the UserAuth reference in UserAddrInf
        const userDetails = await UserAddrInf.findOne({ user: userId })
            .populate('user', '-password -termsAndCond -key -rstPswrdQnA'); // Excluding sensitive fields

        if (!userDetails) {
            return res.status(404).json({ success: false, message: 'User details not found' });
        }

        res.status(200).json({ success: true, data: userDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch user details' });
    }
});

// Change genre preference A12
router.put('/usergenres/change', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { genrePref } = req.body;

        // Update the genre preferences for the user
        const user = await UserAddrInf.findOneAndUpdate({ user: userId }, { genrePref: genrePref });

        const userActivity = new UserActivity({
            activityName: `Genre-Preference-Changed`,
            user: userId
        });
        await userActivity.save();
        res.status(200).json({ success: true, message: 'Genre preferences updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update genre preferences' });
    }
});

// Change language preferences A12
router.put('/userlang/change', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { langPref } = req.body;

        // Update the language preferences for the user
        const user = await UserAddrInf.findOneAndUpdate({ user: userId }, { langPref: langPref });

        const userActivity = new UserActivity({
            activityName: `Language-Preference-Changed`,
            user: userId
        });
        await userActivity.save();

        res.status(200).json({ success: true, message: 'Language preferences updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update language preferences' });
    }
});

// Change dark/light mode preference A15
router.put('/darklight/change', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch darkOrLight from userExtraInf
        const userExtra = await UserExtraInf.findOne({ user: userId });
        const currentMode = userExtra.darkOrLight;

        // Toggle between dark and light mode
        const newMode = currentMode === 'dark' ? 'light' : 'dark';

        // Update the darkOrLight field for the user
        await UserExtraInf.findOneAndUpdate({ user: userId }, { darkOrLight: newMode });

        const userActivity = new UserActivity({
            activityName: `App-Apearence-Changed-From-${currentMode}-To${newMode}`,
            user: userId
        });
        await userActivity.save();

        res.status(200).json({ success: true, message: 'Dark/light mode preference updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update dark/light mode preference' });
    }
});

// Change voice feature preference A15
router.put('/voicefeature/change', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch voiceFeature from userExtraInf
        const userExtra = await UserExtraInf.findOne({ user: userId });
        const currentFeature = userExtra.voiceFeature;

        // Toggle the voice feature preference
        const newFeature = !currentFeature;

        // Update the voiceFeature field for the user
        await UserExtraInf.findOneAndUpdate({ user: userId }, { voiceFeature: newFeature });

        const userActivity = new UserActivity({
            activityName: `Voice-Feature-Changed-From-${currentFeature}-To${newFeature}`,
            user: userId
        });
        await userActivity.save();

        res.status(200).json({ success: true, message: 'Voice feature preference updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update voice feature preference' });
    }
});

// Change getting started
router.put('/gettingstarted/change', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        const userExtra = await UserExtraInf.findOne({ user: userId });
        const currentFeature = userExtra.getStartedDone;

        const newFeature = !currentFeature;

        await UserExtraInf.findOneAndUpdate({ user: userId }, { getStartedDone: newFeature });

        const userActivity = new UserActivity({
            activityName: `Getting-Started-Changed-From-${currentFeature}-To${newFeature}`,
            user: userId
        });
        await userActivity.save();

        res.status(200).json({ success: true, message: 'getting started updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update getting started' });
    }
});


// Change push notification preference A15
router.put('/pushnotification/change', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch pushNotification from userExtraInf
        const userExtra = await UserExtraInf.findOne({ user: userId });
        const currentNotification = userExtra.pushNotification;

        // Toggle the push notification preference
        const newNotification = !currentNotification;

        // Update the pushNotification field for the user
        await UserExtraInf.findOneAndUpdate({ user: userId }, { pushNotification: newNotification });

        const userActivity = new UserActivity({
            activityName: `Push-Notification-Changed-From-${currentNotification}-To${newNotification}`,
            user: userId
        });
        await userActivity.save();

        res.status(200).json({ success: true, message: 'Push notification preference updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update push notification preference' });
    }
});


//signout User A15
router.post('/signout', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

        const userActivity = new UserActivity({
            activityName: `Signout`,
            user: userId
        });
        await userActivity.save();

        res.status(200).json({ success: true, message: 'User Sign Out' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to Sign Out' });
    }
});


//Delete All Details Regarding User A15
router.delete('/deactivate', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;

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


        res.status(200).json({ success: true, message: 'User account deactivated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to deactivate user account' });
    }
});

router.get('/chatbot/link', async (req, res) => {
    try {
        const link = await chatbotLink.findOne()
        res.status(200).json({ success: true, link: link });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get link' });
    }
});

router.post('/chatbot/link', async (req, res) => {
    try {
        const { link } = req.body;
        let chatLink = await chatbotLink.findOne();
        if (chatLink) {
            chatLink.link = link;
        } else {
            chatLink = new chatbotLink({ link });
        }
        await chatLink.save(); // Save the document
        res.status(200).json({ success: true, message: 'Chatbot link updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update chatbot link' });
    }
});

// GET route to fetch the recommendation link
router.get('/recommendation/link', async (req, res) => {
    try {
        const link = await RecommendationLink.findOne();
        res.status(200).json({ success: true, link: link });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get recommendation link' });
    }
});

// POST route to update the recommendation link
router.post('/recommendation/link', async (req, res) => {
    try {
        const { link } = req.body;
        let recommendationLink = await RecommendationLink.findOne();
        if (recommendationLink) {
            recommendationLink.link = link;
        } else {
            recommendationLink = new RecommendationLink({ link });
        }
        await recommendationLink.save(); // Save the document
        res.status(200).json({ success: true, message: 'Recommendation link updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update recommendation link' });
    }
});

export default router;
