import LeetCodeUser from "../Models/LeetCode.js";
import CodeforcesUser from "../Models/CodeForces.js";
import CodeChefUser from "../Models/CodeChef.js";
import GeeksforGeeksUser from "../Models/GeeksforGeeks.js";
import GitHubUser from "../Models/GitHub.js";
import User from "../Models/User.js";

function normalizeDate(input) {
    if (typeof input === "number") {
        // If the number is less than 10 digits, assume seconds; otherwise, milliseconds.
        return new Date(input < 10000000000 ? input * 1000 : input);
    }
    if (typeof input === "string") {
        // Check for format "YY-MM-DD" (e.g. "25-01-01")
        const yyMmDdRegex = /^\d{2}-\d{2}-\d{2}$/;
        if (yyMmDdRegex.test(input)) {
            const [yy, mm, dd] = input.split("-");
            return new Date(`20${yy}-${mm}-${dd}`);
        }
        // Check for format "DD-MM-YYYY" (e.g. "01-01-2025")
        const ddMmYyyyRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (ddMmYyyyRegex.test(input)) {
            const [dd, mm, yyyy] = input.split("-");
            return new Date(`${yyyy}-${mm}-${dd}`);
        }
        // Otherwise, try to parse directly.
        return new Date(input);
    }
    if (input instanceof Date) {
        return input;
    }
    return null;
}

function aggregateActivity(activityArray) {
    const result = {};
    activityArray.forEach((item) => {
        const dateObj = normalizeDate(item.date);
        if (!dateObj || isNaN(dateObj)) return; // skip invalid dates
        const dateStr = dateObj.toISOString().slice(0, 10);
        if (!result[dateStr]) {
            result[dateStr] = { submissions: 0, contributions: 0 };
        }
        // Some platforms use "submissions", others use "value"
        if (typeof item.submissions === "number") {
            result[dateStr].submissions += item.submissions;
        } else if (typeof item.value === "number") {
            result[dateStr].submissions += item.value;
        }
        // Add contributions if provided
        if (typeof item.contributions === "number") {
            result[dateStr].contributions += item.contributions;
        }
    });
    return result;
}

function groupByYear(aggregatedData) {
    const grouped = {};
    Object.keys(aggregatedData).forEach((dateStr) => {
        const year = dateStr.slice(0, 4);
        if (!grouped[year]) {
            grouped[year] = [];
        }
        grouped[year].push({
            date: dateStr,
            submissions: aggregatedData[dateStr].submissions,
            contributions: aggregatedData[dateStr].contributions,
        });
    });
    // Optionally, sort each year's array by date
    Object.keys(grouped).forEach((year) => {
        grouped[year].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    return grouped;
}


function processGitHubActivity(githubSubmissions) {
    const activityData = [];
    Object.keys(githubSubmissions).forEach((yearKey) => {
        const calendar = githubSubmissions[yearKey];
        if (Array.isArray(calendar)) {
            calendar.forEach((entry) => {
                const { date, submissions } = entry;
                activityData.push({ date, contributions: submissions });
            });
        }
    });
    return activityData;
}

export const checkUserProfile = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ error: "Username parameter is required" });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(200).json({
                exists: false,
                data: null,
            });
        }

        // Get the platform IDs from the User document
        const leetid = user?.LeetCode || null;
        const codeforcesid = user?.CodeForces || null;
        const codechefid = user?.CodeChef || null;
        const githubid = user?.Github || null;
        const geeksforgeeksid = user?.GeeksforGeeks || null;

        const [leetCodeProfile, codeforcesProfile, codechefProfile, githubProfile, geeksforgeeksProfile] = await Promise.all([
            leetid ? LeetCodeUser.findById(leetid) : null,
            codeforcesid ? CodeforcesUser.findById(codeforcesid) : null,
            codechefid ? CodeChefUser.findById(codechefid) : null,
            githubid ? GitHubUser.findById(githubid) : null,
            geeksforgeeksid ? GeeksforGeeksUser.findById(geeksforgeeksid) : null,
        ]);

        // Combine all submission/contribution activity data across platforms.
        let allActivityData = [];

        // --- GitHub Activity ---
        if (githubProfile && githubProfile.submissions) {
            const gitActivity = processGitHubActivity(githubProfile.submissions);
            allActivityData.push(...gitActivity);
        }
        // console(allActivityData.length);

        // --- CodeForces Activity ---
        if (codeforcesProfile && codeforcesProfile.submissions) {
            Object.values(codeforcesProfile.submissions).forEach((calendar) => {
                allActivityData.push(...calendar);
            });
        }

        // console(allActivityData.length);
        // --- CodeChef Activity ---
        if (codechefProfile) {
            ["ActivityCalender2022", "ActivityCalender2023", "ActivityCalender2024", "ActivityCalender2025"].forEach((key) => {
                if (codechefProfile[key]) {
                    allActivityData.push(...codechefProfile[key]);
                }
            });
        }
        // console(allActivityData.length);

        // --- LeetCode Activity ---
        if (leetCodeProfile) {
            ["submissions_2024", "submissions_2025"].forEach((key) => {
                if (leetCodeProfile[key] && leetCodeProfile[key].submissionCalendar) {
                    allActivityData.push(...leetCodeProfile[key].submissionCalendar);
                }
            });
        }
        // console(allActivityData.length);

        const aggregatedActivity = aggregateActivity(allActivityData);
        // console(allActivityData.length);
        const heatMapData = groupByYear(aggregatedActivity);

        const totalActiveDays = Object.keys(aggregatedActivity).length;

        // Sum total submissions and contributions.
        let totalSubmissions = 0;
        let totalContributions = 0;
        Object.values(aggregatedActivity).forEach((day) => {
            totalSubmissions += day.submissions;
            totalContributions += day.contributions;
        });

        // Average Contest Rating (from available contest data)
        let contestRatings = [];
        if (codeforcesProfile && codeforcesProfile.contests && codeforcesProfile.contests.length > 0) {
            // For example, use the last contest's new rating.
            const lastContest = codeforcesProfile.contests[codeforcesProfile.contests.length - 1];
            if (lastContest.newRating) contestRatings.push(lastContest.newRating);
        }
        if (codechefProfile && codechefProfile.currentRating) {
            contestRatings.push(codechefProfile.currentRating);
        }
        if (leetCodeProfile && leetCodeProfile.contests && leetCodeProfile.contests.contestRating) {
            contestRatings.push(leetCodeProfile.contests.contestRating);
        }

        if (geeksforgeeksProfile && geeksforgeeksProfile?.contestRating && geeksforgeeksProfile?.contestRating[2]!=='__') {
            contestRatings.push(parseInt(geeksforgeeksProfile.contestRating[2]));
        }
        const avgContestRating = contestRatings.length > 0
            ? contestRatings.reduce((a, b) => a + b, 0) / contestRatings.length
            : 0;

        // Total Problems Solved (from different platforms)
        let totalProblemsSolved = 0;
        if (codeforcesProfile && codeforcesProfile.problemSolved) {
            totalProblemsSolved += codeforcesProfile.problemSolved;
        }

        if (leetCodeProfile && leetCodeProfile.profile && leetCodeProfile.profile.totalSolved) {
            totalProblemsSolved += leetCodeProfile.profile.totalSolved;
        }
        if (geeksforgeeksProfile && geeksforgeeksProfile.contestRating) {
            totalProblemsSolved += parseInt(geeksforgeeksProfile.contestRating[1]);
        }

        // Number of Hard Problems Solved (assuming available from LeetCode)
        let hardProblemsSolved = 0;
        if (leetCodeProfile && leetCodeProfile.profile && leetCodeProfile.profile.hardSolved) {
            hardProblemsSolved += leetCodeProfile.profile.hardSolved;
        }

        if (geeksforgeeksProfile && geeksforgeeksProfile.difficultyLevels) {
            // // console(geeksforgeeksProfile.difficultyLevels[4].solved)
            hardProblemsSolved += geeksforgeeksProfile.difficultyLevels[4].solved;
        }

        if (codeforcesProfile && codeforcesProfile?.problemsSolvedByRating) {
            const arr = codeforcesProfile?.problemsSolvedByRating;
            // // console(arr);
            if ((arr.length-1)>2 && arr[arr.length - 1][0] >= 1400) {
                hardProblemsSolved += arr[arr.length - 1][1].length;
            }
        }

        // Compute an overall score (using an arbitrary weighted formula)
        const overallScore =
            (avgContestRating * 0.3) +
            (totalProblemsSolved * 0.2) +
            (totalActiveDays * 0.1) +
            (totalSubmissions * 0.1) +
            (totalContributions * 0.1) +
            (hardProblemsSolved * 0.2);

        // Use proper assignment to update the user fields
        user.overallScore = typeof overallScore !== 'undefined' ? overallScore : user.overallScore;
        user.totalActiveDays = typeof totalActiveDays !== 'undefined' ? totalActiveDays : user.totalActiveDays;
        user.totalSubmissions = typeof totalSubmissions !== 'undefined' ? totalSubmissions : user.totalSubmissions;
        user.totalContributions = typeof totalContributions !== 'undefined' ? totalContributions : user.totalContributions;
        user.totalProblemSolved = typeof totalProblemsSolved !== 'undefined' ? totalProblemsSolved : user.totalProblemSolved;
        user.avgContestRating = typeof avgContestRating !== 'undefined' ? avgContestRating : user.avgContestRating;
        user.hardProblemsSolved = typeof hardProblemsSolved !== 'undefined' ? hardProblemsSolved : user.hardProblemsSolved;
        user.combinedSubmissions = heatMapData ? heatMapData : user.combinedSubmissions;

        await user.save();

        return res.status(200).json({
            exists: true,
            data: user,
            leetCodeProfile,
            codechefProfile,
            githubProfile,
            geeksforgeeksProfile,
            codeforcesProfile
        });

    } catch (error) {
        console.error("Error checking username availability:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

import { updateCodeforcesUserData } from "./Helper/CodeForces.js";
import { updateCodeChefUserData } from "./Helper/CodeChef.js";
import { updateGFGUserData } from "./Helper/GeeksForGeeks.js";
import { updateLeetCodeUserData } from "./Helper/LeetCode.js";
import { updateGitHubUserData } from "./Helper/Github.js";

export const refreshWholeProfile = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        // console("Refreshing profile for:", username);

        // Run all update functions concurrently, each with its own try-catch block
        const results = await Promise.allSettled([
            (async () => {
                try {
                    return await updateCodeforcesUserData(username);
                } catch (error) {
                    return { error: error.message };
                }
            })(),
            (async () => {
                try {
                    return await updateCodeChefUserData(username);
                } catch (error) {
                    return { error: error.message };
                }
            })(),
            (async () => {
                try {
                    return await updateGFGUserData(username);
                } catch (error) {
                    return { error: error.message };
                }
            })(),
            (async () => {
                try {
                    return await updateLeetCodeUserData(username);
                } catch (error) {
                    return { error: error.message };
                }
            })(),
            (async () => {
                try {
                    return await updateGitHubUserData(username);
                } catch (error) {
                    return { error: error.message };
                }
            })()
        ]);

        return res.status(200).json({
            message: "Profile update process completed",
            success: true,
            // details: responseSummary, // Return details of each update
        });
    } catch (error) {
        console.error("Error refreshing whole profile:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
