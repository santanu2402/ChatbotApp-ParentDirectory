import mongoose from 'mongoose';

const userSearchHistorySchema = new mongoose.Schema({
    searchTitle: {
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
const UserSearchHistory = mongoose.model('UserSearchHistory', userSearchHistorySchema);
export default UserSearchHistory;