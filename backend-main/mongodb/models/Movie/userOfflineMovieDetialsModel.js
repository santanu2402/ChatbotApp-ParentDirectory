import mongoose from 'mongoose';

const userOfflineMovieDetailsSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true,
    },
    movieTitle: {
        type: String,
        required: true,
    },
    movieImageLink: {
        type: String,
    },
    movieRating: {
        type: String,
    },
    movieOverview: {
        type: String,
    },
    movieReleasedDate: {
        type: String,
    },
    movieRuntime: {
        type: Number,
    },
    movieCountryOfOrigin: {
        type: String,
    },
    movieLanguage: {
        type: String,
    },
    movieRevenue: {
        type: String,
    },
    movieDirector: {
        type: String,
    },
    movieProductionCompany: {
        type: Array,
    },
    movieCast: {
        type: Array, // Define it as an array of strings
    },

    movieGenre: {
        type: Array,// Define it as an array of strings
    },

    // Reference to UserAuth
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAuth',
        required: true
    }
});
const UserOfflineMovieDetails = mongoose.model('UserOfflineMovieDetails', userOfflineMovieDetailsSchema);
export default UserOfflineMovieDetails;








