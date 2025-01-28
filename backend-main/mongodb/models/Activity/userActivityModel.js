import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
    activityName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Reference to UserAuth
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAuth',
        required: true
    }
});
const UserActivity = mongoose.model('UserActivity', userActivitySchema);
export default UserActivity;