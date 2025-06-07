// controllers/dashboardController.js
import User from '../../Models/User.js';             // All candidates
import LeetCodeUser from "../../Models/LeetCode.js";
import GeeksforGeeksUser from "../../Models/GeeksforGeeks.js";
import CodeChefUser from "../../Models/CodeChef.js";
import CodeforcesUser from "../../Models/CodeForces.js";
import GitHubUser from "../../Models/GitHub.js";


export const getDashboardStats = async (req, res) => {
    try {
        // Fetch counts concurrently using Promise.all
        const [
            totalCandidates,
            totalLeetcode,
            totalCodechef,
            totalCodeforces,
            totalGitHub,
            totalGFG,
        ] = await Promise.all([
            User.countDocuments({}),
            LeetCodeUser.countDocuments({}),
            CodeChefUser.countDocuments({}),
            CodeforcesUser.countDocuments({}),
            GitHubUser.countDocuments({}),
            GeeksforGeeksUser.countDocuments({}),
        ]);

        res.status(200).json({
            totalCandidates,
            totalLeetcode,
            totalCodechef,
            totalCodeforces,
            totalGitHub,
            totalGFG,
        });
    } catch (error) {
        console.error("Error fetching dashboard stats", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
