import mongoose from 'mongoose';

const webpageAnalyticsSchema = new mongoose.Schema({
    visitorCounter: {
        type: Number,
        default: 0
    },
    engagementDuration: {
        type: Number,
        default: 0
    }
});
const WebpageAnalytics = mongoose.model('WebpageAnalytics', webpageAnalyticsSchema);
export default WebpageAnalytics;