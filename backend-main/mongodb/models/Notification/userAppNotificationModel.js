import mongoose from 'mongoose';

const userAppNotificationSchema = new mongoose.Schema({
    movieId: {
        type: String,
    },
    movieTitle: {
        type: String,
    },
    movieGroup: {
        type: String
    },
    imageUrl: {
        type: String
    },
    // Reference to UserAuth
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAuth',
        required: true
    }
});
const UserAppNotification = mongoose.model('UserAppNotification', userAppNotificationSchema);
export default UserAppNotification;