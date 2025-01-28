import mongoose from 'mongoose';

const userAnalyticsSchema = new mongoose.Schema({
    searchCounter:{
        type: Number,
        default: 0
    },
    ratingSubmittedCounter:{
        type: Number,
        default: 0
    },
    sharingCounter:{
        type: Number,
        default: 0
    },
    feedbackCounter:{
        type: Number,
        default: 0
    },
    reportCounter:{
        type: Number,
        default: 0
    },
    moviePageVisitCounter:{
        type: Number,
        default: 0
    },
    favlistCounter:{
        type: Number,
        default: 0
    },
    alreadyWatchlistCounter:{
        type: Number,
        default: 0
    },
    watchlistCounter:{
        type: Number,
        default: 0
    },
    engagementDuration: {
        type: Number,
        default: 0
    },
    // Reference to UserAuth
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAuth',
        required: true
    }
});
const UserAnalytics = mongoose.model('UserAnalytics', userAnalyticsSchema);
export default UserAnalytics;