import LeetCodeUser from "../../Models/LeetCode.js";
import GeeksforGeeksUser from "../../Models/GeeksforGeeks.js";
import CodeChefUser from "../../Models/CodeChef.js";
import CodeforcesUser from "../../Models/CodeForces.js";
import GitHubUser from "../../Models/GitHub.js";

export const fetchPlatformData = async (candidate) => {
    const [
        leetcodeData,
        codechefData,
        codeforcesData,
        githubData,
        gfgData,
    ] = await Promise.all([
        candidate.LeetCode ? LeetCodeUser.findById(candidate.LeetCode) : Promise.resolve(null),
        candidate.CodeChef ? CodeChefUser.findById(candidate.CodeChef) : Promise.resolve(null),
        candidate.CodeForces ? CodeforcesUser.findById(candidate.CodeForces) : Promise.resolve(null),
        candidate.Github ? GitHubUser.findById(candidate.Github) : Promise.resolve(null),
        candidate.GeeksforGeeks ? GeeksforGeeksUser.findById(candidate.GeeksforGeeks) : Promise.resolve(null),
    ]);
    return { leetcode: leetcodeData, codechef: codechefData, codeforces: codeforcesData, github: githubData, gfg: gfgData };
};

// Helper to safely get a nested value using a dot-separated path.
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((o, key) => (o ? o[key] : undefined), obj) || 0;
};

// Unordered map for CodeForces rank conversion.
const rankMap = {
    "unranked": 0,
    "newbie": 1,
    "pupil": 2,
    "specialist": 3,
    "expert": 4,
    "candidate master": 5,
    "master": 6,
    "international master": 7,
    "grandmaster": 8,
    "international grandmaster": 9,
    "legendary grandmaster": 10
};

export const comparePlatform = (platform, data1, data2) => {
    let score1 = 0;
    let score2 = 0;
    const metrics = []; // 2D vector: each element is an object { label, candidate1, candidate2 }

    switch (platform) {
        case 'leetcode': {
            // Compare total solved problems, medium problems solved, ranking, contest rating, and active days.
            const solved1 = getNestedValue(data1, 'profile.totalSolved');
            const solved2 = getNestedValue(data2, 'profile.totalSolved');
            const mediumSolved1 = getNestedValue(data1, 'profile.mediumSolved');
            const mediumSolved2 = getNestedValue(data2, 'profile.mediumSolved');
            const ranking1 = getNestedValue(data1, 'profile.ranking');
            const ranking2 = getNestedValue(data2, 'profile.ranking');
            const contestRating1 = getNestedValue(data1, 'contests.contestRating');
            const contestRating2 = getNestedValue(data2, 'contests.contestRating');
            const activeDays1 = (getNestedValue(data1, 'submissions_2024.totalActiveDays')) +
                (getNestedValue(data1, 'submissions_2025.totalActiveDays'));
            const activeDays2 = (getNestedValue(data2, 'submissions_2024.totalActiveDays')) +
                (getNestedValue(data2, 'submissions_2025.totalActiveDays'));

            metrics.push({ label: 'Problems Solved', candidate1: solved1, candidate2: solved2 });
            metrics.push({ label: 'Medium Solved', candidate1: mediumSolved1, candidate2: mediumSolved2 });
            metrics.push({ label: 'Ranking', candidate1: ranking1, candidate2: ranking2 });
            metrics.push({ label: 'Contest Rating', candidate1: contestRating1, candidate2: contestRating2 });
            metrics.push({ label: 'Active Days', candidate1: activeDays1, candidate2: activeDays2 });

            if (solved1 > solved2) score1++; else if (solved2 > solved1) score2++;
            if (mediumSolved1 > mediumSolved2) score1++; else if (mediumSolved2 > mediumSolved1) score2++;
            // For ranking lower is better. So we invert the comparison.
            if (ranking1 < ranking2) score1++; else if (ranking1 > ranking2) score2++;
            if (contestRating1 > contestRating2) score1++; else if (contestRating1 < contestRating2) score2++;
            if (activeDays1 > activeDays2) score1++; else if (activeDays1 < activeDays2) score2++;

            break;
        }
        case 'codechef': {
            // Assume CodeChef data contains "currentRating", "globalRank", "stars", and activity calendars.
            const rating1 = getNestedValue(data1, 'currentRating');
            const rating2 = getNestedValue(data2, 'currentRating');
            const globalRank1 = getNestedValue(data1, 'globalRank');
            const globalRank2 = getNestedValue(data2, 'globalRank');
            // stars stored as an array; we take the first element and convert to integer.
            const stars1 = parseInt(getNestedValue(data1, 'stars')[0]) || 0;
            const stars2 = parseInt(getNestedValue(data2, 'stars')[0]) || 0;
            // Assume activity calendars are arrays of dates.
            const activeDays1 = (getNestedValue(data1, 'ActivityCalender2022')?.length || 0) +
                (getNestedValue(data1, 'ActivityCalender2023')?.length || 0) +
                (getNestedValue(data1, 'ActivityCalender2024')?.length || 0) +
                (getNestedValue(data1, 'ActivityCalender2025')?.length || 0);
            const activeDays2 = (getNestedValue(data2, 'ActivityCalender2022')?.length || 0) +
                (getNestedValue(data2, 'ActivityCalender2023')?.length || 0) +
                (getNestedValue(data2, 'ActivityCalender2024')?.length || 0) +
                (getNestedValue(data2, 'ActivityCalender2025')?.length || 0);

            metrics.push({ label: 'Rating', candidate1: rating1, candidate2: rating2 });
            metrics.push({ label: 'Global Rank', candidate1: globalRank1, candidate2: globalRank2 });
            metrics.push({ label: 'Stars', candidate1: stars1, candidate2: stars2 });
            metrics.push({ label: 'Active Days', candidate1: activeDays1, candidate2: activeDays2 });

            if (rating1 > rating2) score1++; else if (rating1 < rating2) score2++;
            // For global rank, lower is better.
            if (globalRank1 < globalRank2) score1++; else if (globalRank1 > globalRank2) score2++;
            if (stars1 > stars2) score1++; else if (stars1 < stars2) score2++;
            if (activeDays1 > activeDays2) score1++; else if (activeDays1 < activeDays2) score2++;

            break;
        }
        case 'codeforces': {
            // Assume CodeForces data has "currentRating", "rank", "problemSolved", and submission calendars.
            const contestRating1 = getNestedValue(data1, 'currentRating');
            const contestRating2 = getNestedValue(data2, 'currentRating');
            const rankStr1 = getNestedValue(data1, 'rank');
            const rankStr2 = getNestedValue(data2, 'rank');
            const rankVal1 = rankMap[rankStr1] || 0;
            const rankVal2 = rankMap[rankStr2] || 0;
            const problemSolved1 = getNestedValue(data1, 'problemSolved');
            const problemSolved2 = getNestedValue(data2, 'problemSolved');
            // Aggregate active days from submission calendars (assuming these are arrays).
            const activeDays1 =
                (getNestedValue(data1, 'submissions.submissionCalendar2022')?.length || 0) +
                (getNestedValue(data1, 'submissions.submissionCalendar2023')?.length || 0) +
                (getNestedValue(data1, 'submissions.submissionCalendar2024')?.length || 0) +
                (getNestedValue(data1, 'submissions.submissionCalendar2025')?.length || 0);
            const activeDays2 =
                (getNestedValue(data2, 'submissions.submissionCalendar2022')?.length || 0) +
                (getNestedValue(data2, 'submissions.submissionCalendar2023')?.length || 0) +
                (getNestedValue(data2, 'submissions.submissionCalendar2024')?.length || 0) +
                (getNestedValue(data2, 'submissions.submissionCalendar2025')?.length || 0);
            const problemsSolvedByRating1 = (getNestedValue(data1, 'problemsSolvedByRating') || []).length;
            const problemsSolvedByRating2 = (getNestedValue(data2, 'problemsSolvedByRating') || []).length;

            metrics.push({ label: 'Contest Rating', candidate1: contestRating1, candidate2: contestRating2 });
            metrics.push({ label: 'Rank Value', candidate1: rankVal1, candidate2: rankVal2 });
            metrics.push({ label: 'Problem Solved', candidate1: problemSolved1, candidate2: problemSolved2 });
            metrics.push({ label: 'Problems Solved Ratingwise', candidate1: problemsSolvedByRating1, candidate2: problemsSolvedByRating2 });
            metrics.push({ label: 'Active Days', candidate1: activeDays1, candidate2: activeDays2 });

            if (contestRating1 > contestRating2) score1++; else if (contestRating1 < contestRating2) score2++;
            // For rank, lower is better so compare inversely.
            if (rankVal1 > rankVal2) score1++; else if (rankVal1 < rankVal2) score2++;
            if (problemSolved1 > problemSolved2) score1++; else if (problemSolved1 < problemSolved2) score2++;
            if (problemsSolvedByRating1 > problemsSolvedByRating2) score1++; else if (problemsSolvedByRating1 < problemsSolvedByRating2) score2++;
            if (activeDays1 > activeDays2) score1++; else if (activeDays1 < activeDays2) score2++;

            break;
        }
        case 'github': {
            // Assume GitHub data has "totalContributions", "active_days", "collaborated_repos", and "repos".
            const contributions1 = getNestedValue(data1, 'totalContributions');
            const contributions2 = getNestedValue(data2, 'totalContributions');
            const activeDays1 = getNestedValue(data1, 'active_days');
            const activeDays2 = getNestedValue(data2, 'active_days');
            const collaboratedRepos1 = (getNestedValue(data1, 'collaborated_repos') || []).length;
            const collaboratedRepos2 = (getNestedValue(data2, 'collaborated_repos') || []).length;
            const repos1 = (getNestedValue(data1, 'repos') || []).length;
            const repos2 = (getNestedValue(data2, 'repos') || []).length;

            metrics.push({ label: 'Contributions', candidate1: contributions1, candidate2: contributions2 });
            metrics.push({ label: 'Active Days', candidate1: activeDays1, candidate2: activeDays2 });
            metrics.push({ label: 'Collaborated Repos', candidate1: collaboratedRepos1, candidate2: collaboratedRepos2 });
            metrics.push({ label: 'Repos', candidate1: repos1, candidate2: repos2 });

            if (contributions1 > contributions2) score1++; else if (contributions1 < contributions2) score2++;
            if (activeDays1 > activeDays2) score1++; else if (activeDays1 < activeDays2) score2++;
            if (collaboratedRepos1 > collaboratedRepos2) score1++; else if (collaboratedRepos1 < collaboratedRepos2) score2++;
            if (repos1 > repos2) score1++; else if (repos1 < repos2) score2++;

            break;
        }
        case 'gfg': {
            // Assume GeeksforGeeks data has "contestRating" as an array [codingScore, problemsSolved, contestRating].
            const codingScore1 = parseInt(getNestedValue(data1, 'contestRating')[0]) || 0;
            const codingScore2 = parseInt(getNestedValue(data2, 'contestRating')[0]) || 0;
            const problemSolved1 = parseInt(getNestedValue(data1, 'contestRating')[1]) || 0;
            const problemSolved2 = parseInt(getNestedValue(data2, 'contestRating')[1]) || 0;
            const contestRating1 = parseInt(getNestedValue(data1, 'contestRating')[2]) || 0;
            const contestRating2 = parseInt(getNestedValue(data2, 'contestRating')[2]) || 0;

            metrics.push({ label: 'Coding Score', candidate1: codingScore1, candidate2: codingScore2 });
            metrics.push({ label: 'Problems Solved', candidate1: problemSolved1, candidate2: problemSolved2 });
            metrics.push({ label: 'Contest Rating', candidate1: contestRating1, candidate2: contestRating2 });

            if (codingScore1 > codingScore2) score1++; else if (codingScore1 < codingScore2) score2++;
            if (problemSolved1 > problemSolved2) score1++; else if (problemSolved1 < problemSolved2) score2++;
            if (contestRating1 > contestRating2) score1++; else if (contestRating1 < contestRating2) score2++;

            break;
        }
        default:
            break;
    }

    let platformWinner = 'tie';
    if (score1 > score2) platformWinner = 'candidate1';
    else if (score2 > score1) platformWinner = 'candidate2';

    return { metrics, score1, score2, platformWinner };
};
