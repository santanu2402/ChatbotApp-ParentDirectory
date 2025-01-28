import mongoose from 'mongoose';

const ChatbotLinkSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    }
});
const chatbotLink = mongoose.model('chatbotLink', ChatbotLinkSchema);
export default chatbotLink;