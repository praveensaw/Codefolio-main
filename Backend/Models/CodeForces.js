import mongoose from "mongoose";

const CodeForcesUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  country: { type: String, default: "N/A" },
  city: { type: String, default: "" },
  rating: { type: Number, default: 0 }, // current rating
  currentRating: { type: Number, default: 0 },
  maxRating: { type: Number, default: 0 },
  rank: { 
    type: String, 
    default: "unranked", 
    enum: [
      "unranked", "newbie", "pupil", "specialist", "expert", 
      "candidate master", "master", "international master", 
      "grandmaster", "international grandmaster", "legendary grandmaster"
    ]
  },
  maxRank: { type: String, default: "" },
  registrationTimeSeconds: { type: Number, default: 0 },
  friendOfCount: { type: Number, default: 0 },
  contribution: { type: Number, default: 0 },
  avatar: { type: String, default: "" },
  titlePhoto: { type: String, default: "" },
  organization: { type: String, default: "N/A" },
  problemSolved: { type: Number, default: 0 },
  contests: [
    {
      contestId: { type: Number, required: true },
      contestName: { type: String, required: true },
      rank: { type: Number, default: null },
      oldRating: { type: Number, default: 0 },
      newRating: { type: Number, default: 0 },
      ratingUpdateTimeSeconds: { type: String, default: 0 },
    },
  ],
  problemsSolvedByRating: [
    {
    //   rating: { type: Number, required: true },
    //   problems: { type: [String], default: [] }
    }
  ],
  submissions: {
    submissionCalendar2024: [{ date: { type: String }, submissions: { type: Number } }],
    submissionCalendar2025: [{ date: { type: String }, submissions: { type: Number } }],
    submissionCalendar2023: [{ date: { type: String }, submissions: { type: Number } }],
    submissionCalendar2022: [{ date: { type: String }, submissions: { type: Number } }],
  },
}, { timestamps: true });

export default mongoose.model('CodeforcesUser', CodeForcesUserSchema);
