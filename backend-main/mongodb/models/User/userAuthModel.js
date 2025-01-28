import mongoose from 'mongoose';

const userAuthSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    termsAndCond:{
        type: Boolean,
        required:true
    },
    key: {
        type: Buffer,
        required: true,
      },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const UserAuth = mongoose.model('UserAuth', userAuthSchema);
export default UserAuth;