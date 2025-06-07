import axios from "axios";
import dotenv from "dotenv";
import User from "../Models/User.js";
import { updateCodeforcesUserData } from "./Helper/CodeForces.js";
import CodeforcesUser from "../Models/CodeForces.js"; // Make sure this import is here
dotenv.config();

// Utility function for error handling
const handleError = (res, error) => {
  console.error("Error:", error.message);
  res.status(500).json({ message: "Internal server error", error: error.message });
};

const formatDate = (dateString) => {
  const d = new Date(dateString);
  const year = d.getFullYear().toString().slice(-2); // last two digits
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};



// Fetch Codeforces user info, rating, and status
export const fetchCodeForces = async (req, res) => {
  // console(CodeforcesUser);

  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required in the request body." });
    }

    const findUser = await User.findOne({ username }).exec();
    if (!findUser) {
      return res.status(400).json({ message: "User does not exist in the database" });
    }

    // Check if the Codeforces user already exists in the database
    const existingUser = await CodeforcesUser.findById(findUser.CodeForces);
    if (!existingUser) {
      return res.status(400).json({ message: "Codeforces account already exists in the database" });
    }

    const userStatusUrl = `${process.env.CODEFORCES_API_STATUS}${existingUser.username}&from=1&count=10`;
    const userRatingUrl = `${process.env.CODEFORCES_API_RATING}${existingUser.username}`;
    const userInfoUrl = `${process.env.CODEFORCES_API_USER}${existingUser.username}`;

    const [userResponse, statusResponse, ratingResponse] = await Promise.all([
      axios.get(userInfoUrl),
      axios.get(userStatusUrl),
      axios.get(userRatingUrl),
    ]);

    res.status(200).json({
      info: userResponse.data,
      status: statusResponse.data,
      rating: ratingResponse.data,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Fetch upcoming contests
export const getLatestContest = async (req, res) => {
  try {
    const response = await axios.get(process.env.CODEFORCES_API_CONTESTS);

    if (response.data.status === "OK") {
      const contests = response.data.result.filter((contest) => contest.phase === "BEFORE");
      contests.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);

      const formattedContests = contests.map((contest) => ({
        id: contest.id,
        name: contest.name,
        type: contest.type,
        phase: contest.phase,
        duration: contest.durationSeconds,
        startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
      }));

      res.status(200).json({ success: true, contest: formattedContests });
    } else {
      res.status(500).json({ success: false, message: "Failed to fetch contests from Codeforces." });
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const AddCodeForcesAccount = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: "Email and username are required" });
    }

    // Find the user by email
    const findUser = await User.findOne({ email }).exec();
    if (!findUser) {
      return res.status(400).json({ message: "User does not exist in the database" });
    }

    // Check if the Codeforces account already exists in the database
    const existingUser = await CodeforcesUser.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Codeforces account already exists in the database" });
    }

    // Construct API URLs from environment variables
    const submissionsUrl = `${process.env.CODEFORCES_API_STATUS}${username}&from=1&count=1000`;
    const userInfoUrl = `${process.env.CODEFORCES_API_USER}${username}`;
    const contestRatingUrl = `${process.env.CODEFORCES_API_RATING}${username}`;

    // Fetch data concurrently
    const [submissionsResponse, userInfoResponse, contestRatingResponse] = await Promise.all([
      axios.get(submissionsUrl),
      axios.get(userInfoUrl),
      axios.get(contestRatingUrl),
    ]);

    const submissions = submissionsResponse.data.result;
    const userInfoRaw = userInfoResponse.data.result[0];
    const contestRatingRaw = contestRatingResponse.data.result;

    if (!submissions || !userInfoRaw || !contestRatingRaw) {
      return res.status(400).json({ message: "No submissions found for the given Codeforces username" });
    }

    // Helper: Convert Unix timestamp (seconds) to a formatted date string ("YYYY-MM-DD")
    const convertUnixToDateStr = (timestamp) => {
      const date = new Date(timestamp * 1000);
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
      const day = date.getUTCDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Group solved problems by rating and count unique problems
    const solvedProblemsSet = new Set();
    const problemsByRating = {};
    submissions.forEach((submission) => {
      if (submission.verdict === "OK" && submission.problem) {
        solvedProblemsSet.add(submission.problem.name);
        if (submission.problem.rating) {
          const rating = submission.problem.rating;
          if (!problemsByRating[rating]) {
            problemsByRating[rating] = new Set();
          }
          problemsByRating[rating].add(submission.problem.name);
        }
      }
    });
    const problemsSolved = solvedProblemsSet.size;
    const problemsSolvedByRating = Object.entries(problemsByRating)
      .map(([rating, problemSet]) => [parseInt(rating), Array.from(problemSet)])
      .sort((a, b) => a[0] - b[0]);

    // Process contest rating info: include only required keys
    const contestRatingInfo = contestRatingRaw.map((contest) => ({
      contestId: contest.contestId,
      contestName: contest.contestName,
      handle: contest.handle,
      rank: contest.rank,
      ratingUpdateTimeSeconds: convertUnixToDateStr(parseInt(contest.ratingUpdateTimeSeconds)),
      oldRating: contest.oldRating,
      newRating: contest.newRating,
    }));

    // Group submissions by day for each year
    const submissionCalendars = {};
    submissions.forEach((submission) => {
      const dateStr = convertUnixToDateStr(submission.creationTimeSeconds);
      const year = dateStr.substring(0, 4);
      const key = `submissionCalendar${year}`;
      if (!submissionCalendars[key]) {
        submissionCalendars[key] = {};
      }
      if (!submissionCalendars[key][dateStr]) {
        submissionCalendars[key][dateStr] = 0;
      }
      submissionCalendars[key][dateStr] += 1;
    });

    // Convert each year's calendar object into an array of { date, submissions } objects
    const submissionCalendarsFormatted = {};
    Object.keys(submissionCalendars).forEach((yearKey) => {
      submissionCalendarsFormatted[yearKey] = Object.entries(submissionCalendars[yearKey])
        .map(([date, count]) => ({ date, submissions: count }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    // Prepare userInfo object based on the sample structure.
    // (Assumes userInfoRaw contains these fields; adjust mappings as needed.)
    const userInfo = {
      firstName: userInfoRaw.firstName || "",
      lastName: userInfoRaw.lastName || "",
      country: userInfoRaw.country || "",
      city: userInfoRaw.city || "",
      rating: userInfoRaw.rating || 0,
      friendOfCount: userInfoRaw.friendOfCount || 0,
      titlePhoto: userInfoRaw.titlePhoto || "",
      handle: userInfoRaw.handle,
      avatar: userInfoRaw.avatar || "",
      contribution: userInfoRaw.contribution || 0,
      organization: userInfoRaw.organization || "",
      rank: userInfoRaw.rank || "",
      maxRating: userInfoRaw.maxRating || 0,
      registrationTimeSeconds: userInfoRaw.registrationTimeSeconds || 0,
      maxRank: userInfoRaw.maxRank || "",
    };

    // Create and save new CodeforcesUser document
    const newCodeForcesUser = new CodeforcesUser({
      username: userInfo.handle,
      problemSolved: problemsSolved,
      country: userInfo.country,
      organization: userInfo.organization,
      maxRating: userInfo.maxRating,
      currentRating: userInfo.rating,
      rank: userInfo.rank,
      maxRank: userInfo.maxRank,
      contests: contestRatingInfo,
      problemsSolvedByRating: problemsSolvedByRating,
      submissions: submissionCalendarsFormatted, // if your schema supports this structure
    });
    await newCodeForcesUser.save();

    // Link the Codeforces account with the user profile
    findUser.CodeForces = newCodeForcesUser._id;
    await User.findByIdAndUpdate(findUser._id, { CodeForces: newCodeForcesUser._id });

    // Return response with only the desired fields
    return res.status(201).json({
      success:true,
      message: "Codeforces user data stored successfully",
      newCodeForcesUser
    });
  } catch (error) {
    console.error("Error storing Codeforces user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const UpdateCodeForcesAccount = async (req, res) => {
  try {
    const { username } = req.params;
    const updatedData = await updateCodeforcesUserData(username);
    return res.status(200).json({
      message: "Codeforces user data updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating Codeforces user data:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Fetch contest data for a specific handle
export const fetchCodeforcesContestData = async (req, res) => {
  try {
    const { handle } = currentUser.email;
    // console(handle);

    if (!handle) {
      return res.status(400).json({ message: "Handle is required" });
    }

    const apiResponse = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);

    if (apiResponse.data.status !== "OK") {
      return res.status(400).json({ message: "Error fetching data from Codeforces API" });
    }

    const contests = apiResponse.data.result.map((contest) => ({
      date: new Date(contest.ratingUpdateTimeSeconds * 1000).toISOString().split("T")[0],
      rating: contest.newRating,
      rank: contest.rank,
      contestId: contest.contestId,
      contestName: contest.contestName,
    }));

    let user = await CodeforcesUser.findOne({ handle });
    if (user) {
      user.contests = contests;
      await user.save();
    } else {
      user = new CodeforcesUser({ handle, contests });
      await user.save();
    }

    res.status(200).json({ handle, contests });
  } catch (error) {
    handleError(res, error);
  }
};

export const fetchCodeforcesAccount = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const codeforcesApiUrl = `https://codeforces.com/api/user.status?handle=${username}&from=1&count=1000000`;

    const response = await axios.get(codeforcesApiUrl);

    // Handle cases where API response indicates failure
    if (!response.data || response.data.status === "FAILED") {
      return res.status(404).json({
        success: false,
        message: "User not found or failed to fetch data from Codeforces API",
      }); 
    }

    const submissions = response.data.result.length;
    return res.status(200).json({
      success: true,
      message: "Codeforces user data fetched successfully",
      data: { submissions },
    });
  } catch (error) {
    console.error("Error fetching Codeforces user data:", error);

    if (error.response && error.response.status === 400) {
      return res.status(200).json({ success: false, message: "User not found on Codeforces" });
    }

    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const fetchCodeforcesFromDB = async (req, res) => {
  try {
    const { codeforcesid } = req.params;

    let existingUser = await CodeforcesUser.findById(codeforcesid).exec();

    if (!existingUser) {
      // console("Codeforces user not found, creating a new one.");
      return res.status(400).json({
        success: false,
        message: "Codeforces user not found",
      });
    } else {
      return res.status(200).json({
        data: existingUser,
        success: true,
        message: "Codeforces user found",
      });
    }
  } catch (error) {
    console.error("Error fetching Codeforces user data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteCodeForcesUser = async (req, res) => {
    try {
        const { codeforcesid } = req.params; // The LeetCodeUser ID to delete
    
        // Delete the LeetCodeUser document
        const deletedLeetCodeUser = await CodeforcesUser.findByIdAndDelete(codeforcesid);
        if (!deletedLeetCodeUser) {
          return res.status(404).json({ success: false, message: 'LeetCodeUser not found.' });
        }
    
        await User.findOneAndUpdate(
          { CodeForces: codeforcesid },
          { $unset: { CodeForces: "" } } // Remove the field
        );
    
        return res.status(200).json({ success: true, message: 'LeetCodeUser deleted and reference removed from User.' });
      } catch (error) {
        console.error('Error deleting LeetCodeUser:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
};
