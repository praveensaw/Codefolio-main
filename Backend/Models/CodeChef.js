import mongoose from "mongoose";
import User from "./User.js";
// Define the schema for the profile data
const CodeChefUserSchema = new mongoose.Schema({
    username: String,
    // problemSolved: Number,
    currentRating: Number,
    highestRating: Number,
    countryName: String,
    countryName: String,
    globalRank: Number,
    countryRank: Number,
    stars: String,
    ActivityCalender2022: [
        {
            date: Date,
            value: Number,
        }
    ],
    ActivityCalender2023: [
        {
            date: Date,
            value: Number,
        }
    ],
    ActivityCalender2024: [
        {
            date: Date,
            value: Number,
        }
    ],
    ActivityCalender2025: [
        {
            date: Date,
            value: Number,
        }
    ],
    contests: [
        {
            rating: String,
            rank: String,
            name: String,
            end_date: Date
        }
    ]
}, { timestamps: true });

// Create the model
export default mongoose.model('CodeChefUser', CodeChefUserSchema);

