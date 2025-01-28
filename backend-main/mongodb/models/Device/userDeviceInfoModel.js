import mongoose from 'mongoose';

const userDeviceInfoSchema = new mongoose.Schema({
    osType: {
        type: String,
        enum: ['ios', 'android'],
        required: true,
    },
    andVersion: {
        type: Number,
        default: 0
    },
    andSerial: {
        type: String,
        default: null
    },
    andModel: {
        type: String,
        default: null
    },
    andBrand: {
        type: String,
        default: null
    },
    andManufacturer: {
        type: String,
        default: null
    },
    // Reference to UserAuth
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAuth',
        required: true
    }
});
const UserDeviceInfo = mongoose.model('UserDeviceInfo', userDeviceInfoSchema);
export default UserDeviceInfo;