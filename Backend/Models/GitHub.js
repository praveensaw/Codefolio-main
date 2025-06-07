import mongoose from 'mongoose';
import { type } from 'os';

const GitHubUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    avatar: { type: String },
    url: { type: String },
    pat: { type: String },

    // Repositories (an array of repository objects)
    repos: [{
        name: { type: String },
        description: { type: String },
        languages: { type: [String], default: [] },
        live_link: { type: String },
        git_link: { type: String },
        starred: { type: Number },  // corrected typo here
        commits: { type: Number },
        collaborators: [{
            name: { type: String },
            avatar_col: { type: String },
        }]
    }],

    collaborated_repos: [{
        name: { type: String },
        description: { type: String },
        languages: { type: [String], default: [] },
        live_link: { type: String },
        git_link: { type: String },
        starred: { type: Number },
        commits: { type: Number },
        collaborators: [{
            name: { type: String },
            avatar_col: { type: String },
        }]
    }],

    submissions: {
        submissionCalendar2024: [{ date: { type: String }, submissions: { type: Number } }],
        submissionCalendar2025: [{ date: { type: String }, submissions: { type: Number } }],
        submissionCalendar2023: [{ date: { type: String }, submissions: { type: Number } }],
        submissionCalendar2022: [{ date: { type: String }, submissions: { type: Number } }]
    },

    auth: { type: Boolean, default: false },
    active_days: { type: Number },
    starred_repos: { type: Number },
    bio: { type: String },
    followers: { type: Number },
    following: { type: Number },
    totalContributions: { type: Number },
},
    {
        // Automatically manage createdAt and updatedAt fields
        timestamps: true
    });

export default mongoose.model('GitHubUser', GitHubUserSchema);
