import mongoose from 'mongoose';

const userAddInfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others'],
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    profileImageUrl: {
        type: String
    },
    langPref: {
        type: Array,
        required: true
    },
    genrePref: {
        type: Array,
        required: true
    },
    rstPswrdQnA: {
        type: String,
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
const UserAddrInf = mongoose.model('UserAddrInf', userAddInfSchema);
export default UserAddrInf;