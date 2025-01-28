import mongoose from 'mongoose';

const userReportSchema = new mongoose.Schema({
    reportSubject: {
        type: String,
        required: true,
    },
    reportDescription: {
        type: String,
        required: true,
    },
    reportImageUrl: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['Received', 'Seen', 'Ongoing', 'Resolved'],
        default: 'Received'
    },
    resolvedByAdmin: {
        type: String,
        default: null
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

const UserReport = mongoose.model('UserReport', userReportSchema);
export default UserReport;