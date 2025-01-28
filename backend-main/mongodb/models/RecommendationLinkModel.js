import mongoose from 'mongoose';

// Define the schema for recommendation links
const RecommendationLinkSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    }
});

// Create the model for recommendation links
const RecommendationLink = mongoose.model('RecommendationLink', RecommendationLinkSchema);

export default RecommendationLink;
