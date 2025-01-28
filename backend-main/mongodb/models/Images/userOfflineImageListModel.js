import mongoose from 'mongoose';

const userOfflineImageListSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    pictureId: {
        type: String,
        
    },
        // Reference to UserAuth
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserAuth',
            required: true
        }
});
const UserOfflineImageList = mongoose.model('UserOfflineImageList', userOfflineImageListSchema);
export default UserOfflineImageList;