import mongoose from 'mongoose';

const userFeedbackSchema = new mongoose.Schema({
    feedback: {
        type: String,
        required: true,
    },
    publishedStatus: {
        type: Boolean,
        default: false
    },
    checkedByAdmin: {
        type: String,
        default: null
    },
    orderNo:{
        type:Number,
        default:0
    },
    anonymous: {
        type: Boolean,
        default: false
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

const UserFeedback = mongoose.model('UserFeedback', userFeedbackSchema);
export default UserFeedback;