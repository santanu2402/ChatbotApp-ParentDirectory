import mongoose from 'mongoose';

const adminActivitySchema = new mongoose.Schema({
    adminName:{
        type: String,
        required: true,
    },
    activityName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
const AdminActivity = mongoose.model('AdminActivity', adminActivitySchema);
export default AdminActivity;