import mongoose from 'mongoose';

const userExtraInfSchema = new mongoose.Schema({
  signInDone: {
    type: String,
    default: false
  },
  darkOrLight: {
    type: String,
    enum: ['dark', 'light', 'default'],
    default: 'dark'
  },
  isAddInfoDone: {
    type: Boolean,
    default: false,
  },
  getStartedDone: {
    type: Boolean,
    default: false
  },
  voiceFeature: {
    type: Boolean,
    default: true
  },
  pushNotification:{
    type: Boolean,
    default: true
  },
  // Reference to UserAuth
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAuth',
    required: true
  }
});
const UserExtraInf = mongoose.model('UserExtraInf', userExtraInfSchema);
export default UserExtraInf;