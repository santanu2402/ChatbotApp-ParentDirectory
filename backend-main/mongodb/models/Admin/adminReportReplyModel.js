import mongoose from 'mongoose';

const adminReportReplySchema = new mongoose.Schema({
    adminName:{
        type:String,
        required:true
    },
    replyDescription:{
        type:String,
        required:true
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
    },
    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserReport',
        required: true
    }
});
const AdminReportReply = mongoose.model('AdminReportReply', adminReportReplySchema);
export default AdminReportReply;