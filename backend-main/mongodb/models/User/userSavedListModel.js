import mongoose from 'mongoose';

const userSavedListSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true,
    },
    movieTitle: {
        type: String,
        required: true,
    },
    listName: {
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
const UserSavedList = mongoose.model('UserSavedList', userSavedListSchema);
export default UserSavedList;