import axios from 'axios';
import User from '../../Models/User.js';
import CodeforcesUser from '../../Models/CodeForces.js';

const convertUnixToDateStr = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0];
};


export const updateCodeforcesUserData = async (username) => {
  if (!username) {
    throw new Error("Username is required");
  }

  // Find the user in the DB and check for a linked Codeforces account
  const findUser = await User.findOne({ username }).exec();
  if (!findUser || !findUser.CodeForces) {
    throw new Error("User does not exist or has no linked Codeforces account");
  }

  // Find the associated CodeforcesUser document
  const existingCodeforcesUser = await CodeforcesUser.findById(findUser.CodeForces);
  if (!existingCodeforcesUser) {
    throw new Error("Codeforces user data not found");
  }

  // Construct API URLs using environment variables
  const submissionsUrl = `${process.env.CODEFORCES_API_STATUS}${existingCodeforcesUser.username}&from=1&count=1000`;
  const userInfoUrl = `${process.env.CODEFORCES_API_USER}${existingCodeforcesUser.username}`;
  const contestRatingUrl = `${process.env.CODEFORCES_API_RATING}${existingCodeforcesUser.username}`;

  // Fetch data concurrently from Codeforces APIs
  const [submissionsResponse, userInfoResponse, contestRatingResponse] = await Promise.all([
    axios.get(submissionsUrl),
    axios.get(userInfoUrl),
    axios.get(contestRatingUrl),
  ]);

  const submissions = submissionsResponse.data.result;
  const userInfoRaw = userInfoResponse.data.result[0];
  const contestRatingRaw = contestRatingResponse.data.result;

  if (!submissions || !userInfoRaw || !contestRatingRaw) {
    throw new Error("No submissions found for the given Codeforces username");
  }

  // Process submissions to build solved problems set and problems by rating
  const solvedProblemsSet = new Set();
  const problemsByRating = {};
  submissions.forEach((submission) => {
    if (submission.verdict === "OK" && submission.problem) {
      solvedProblemsSet.add(submission.problem.name);
      if (submission.problem.rating) {
        const rating = submission.problem.rating;
        if (!problemsByRating[rating]) problemsByRating[rating] = new Set();
        problemsByRating[rating].add(submission.problem.name);
      }
    }
  });
  const problemsSolved = solvedProblemsSet.size;
  const problemsSolvedByRating = Object.entries(problemsByRating)
    .map(([rating, problemSet]) => [parseInt(rating), Array.from(problemSet)])
    .sort((a, b) => a[0] - b[0]);
  console.log(problemsByRating);
  

  // Process contest rating info from Codeforces
  const contestRatingInfo = contestRatingRaw.map((contest) => ({
    contestId: contest.contestId,
    contestName: contest.contestName,
    handle: contest.handle,
    rank: contest.rank,
    ratingUpdateTimeSeconds: convertUnixToDateStr(parseInt(contest.ratingUpdateTimeSeconds)),
    oldRating: contest.oldRating,
    newRating: contest.newRating,
  }));

  // Build submission calendars by year
  const submissionCalendars = {};
  submissions.forEach((submission) => {
    const dateStr = convertUnixToDateStr(submission.creationTimeSeconds);
    const year = dateStr.substring(0, 4);
    const key = `submissionCalendar${year}`;
    if (!submissionCalendars[key]) submissionCalendars[key] = {};
    if (!submissionCalendars[key][dateStr]) submissionCalendars[key][dateStr] = 0;
    submissionCalendars[key][dateStr] += 1;
  });
  const submissionCalendarsFormatted = {};
  Object.keys(submissionCalendars).forEach((yearKey) => {
    submissionCalendarsFormatted[yearKey] = Object.entries(submissionCalendars[yearKey])
      .map(([date, count]) => ({ date, submissions: count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  });

  // Build the user info object, using API data and falling back to existing values
  const userInfo = {
    firstName: userInfoRaw.firstName || "",
    lastName: userInfoRaw.lastName || "",
    country: userInfoRaw.country || existingCodeforcesUser.country,
    city: userInfoRaw.city || "",
    rating: userInfoRaw.rating || existingCodeforcesUser.currentRating,
    friendOfCount: userInfoRaw.friendOfCount || 0,
    titlePhoto: userInfoRaw.titlePhoto || "",
    handle: userInfoRaw.handle,
    avatar: userInfoRaw.avatar || "",
    contribution: userInfoRaw.contribution || 0,
    organization: userInfoRaw.organization || existingCodeforcesUser.organization,
    rank: userInfoRaw.rank || existingCodeforcesUser.rank,
    maxRating: userInfoRaw.maxRating || existingCodeforcesUser.maxRating,
    registrationTimeSeconds: userInfoRaw.registrationTimeSeconds || 0,
    maxRank: userInfoRaw.maxRank || existingCodeforcesUser.maxRank,
  };

  // Update the CodeforcesUser document with the gathered data
  existingCodeforcesUser.problemSolved = problemsSolved || existingCodeforcesUser.problemSolved;
  existingCodeforcesUser.country = userInfo.country;
  existingCodeforcesUser.organization = userInfo.organization;
  existingCodeforcesUser.maxRating = userInfo.maxRating;
  existingCodeforcesUser.currentRating = userInfo.rating;
  existingCodeforcesUser.rank = userInfo.rank;
  existingCodeforcesUser.maxRank = userInfo.maxRank;
  existingCodeforcesUser.contests = contestRatingInfo || existingCodeforcesUser.contests;
  existingCodeforcesUser.problemsSolvedByRating = problemsSolvedByRating || existingCodeforcesUser.problemsSolvedByRating;
  existingCodeforcesUser.submissions = submissionCalendarsFormatted || existingCodeforcesUser.submissions;

  // Save the updated document
  await existingCodeforcesUser.save();

  // Optionally, update the User document with the CodeforcesUser id if needed
  await User.findByIdAndUpdate(findUser._id, { CodeForces: existingCodeforcesUser._id });

  return existingCodeforcesUser;
};
