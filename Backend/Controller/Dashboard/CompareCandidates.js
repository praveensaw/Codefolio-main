import User from "../../Models/User.js";
import { fetchPlatformData, comparePlatform } from "./Helper.js";
// Fetch candidates based on search input
export const searchCandidates = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Find candidates whose username starts with the search query (case insensitive)
    const candidates = await User.find({
      username: { $regex: `^${search}`, $options: "i" }
    }).limit(10); // Limit results to 10

    res.status(201).json({ success: true, users: candidates, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Define weights for overall metrics and individual platforms.
// Adjust these weights based on which metrics are more important.
const WEIGHTS = {
  overallScore: 0.3,
  totalProblems: 0.2,
  platforms: {
    codechef: 0.1,
    codeforces: 0.1,
    github: 0.1,
    gfg: 0.05,
    leetcode: 0.15,
  }
};

export const compareTwoCandidates = async (req, res) => {
  try {
    const { candidate1, candidate2 } = req.body;

    const [platformData1, platformData2] = await Promise.all([
      fetchPlatformData(candidate1),
      fetchPlatformData(candidate2),
    ]);

    const platforms = ["leetcode", "codechef", "codeforces", "github", "gfg"];

    let aggregatedWinsCandidate1 = 0;
    let aggregatedWinsCandidate2 = 0;
    const platformComparisons = {};

    platforms.forEach((platform) => {
      if (platformData1[platform] && platformData2[platform]) {
        const result = comparePlatform(
          platform,
          platformData1[platform] || {},
          platformData2[platform] || {}
        );
        platformComparisons[platform] = result;
        if (result.platformWinner === 'candidate1') aggregatedWinsCandidate1++;
        else if (result.platformWinner === 'candidate2') aggregatedWinsCandidate2++;
      }
    });

    let overallWinner = null;
    if (aggregatedWinsCandidate1 > aggregatedWinsCandidate2) overallWinner = candidate1;
    else if (aggregatedWinsCandidate2 > aggregatedWinsCandidate1) overallWinner = candidate2;
    else overallWinner = 'tie';

    return res.status(200).json({
      platformComparisons,
      aggregatedWins: { candidate1: aggregatedWinsCandidate1, candidate2: aggregatedWinsCandidate2 },
      overallWinner,
    });
  } catch (error) {
    console.error("Error comparing candidates:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
