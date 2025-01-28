import mongoose from 'mongoose';

const userRecentlyViewedSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true,
    },
    movieTitle: {
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
const UserRecentlyViewed = mongoose.model('UserRecentlyViewed', userRecentlyViewedSchema);
export default UserRecentlyViewed;