import mongoose from 'mongoose';

const adminReplySchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true,
    },
    replyContent: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Reference to UserReport
    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserReport',
        required: true
    }
});
const AdminReply = mongoose.model('AdminReply', adminReplySchema);
export default AdminReply;