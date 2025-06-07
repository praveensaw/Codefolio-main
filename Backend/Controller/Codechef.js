import axios from 'axios'
import dotenv from 'dotenv'
import { JSDOM } from 'jsdom';
import CodeChefUser from '../Models/CodeChef.js';
import User from '../Models/User.js';
import { updateCodeChefUserData } from './Helper/CodeChef.js';
dotenv.config();

export const getfuturecontest = async (requestAnimationFrame, res) => {
    try {
        const response = await axios.get(`${process.env.codechef_api}`)
        // console(response)

        if (response.data.status === 'success') {
            const futureContest = response.data.future_contests;

            if (futureContest && futureContest.length > 0) {

                const formattedContest = futureContest.map((contest) => ({
                    contest_code: contest.contest_code,
                    contest_name: contest.contest_name,
                    contest_start_date: contest.contest_start_date,
                    contest_end_date: contest.contest_end_date,
                    contest_start_date_iso: contest.contest_start_date_iso,
                    contest_end_date_iso: contest.contest_end_date_iso,
                    contest_duration: contest.contest_duration,
                    distinct_users: contest.distinct_users,
                }));
                res.status(200).json({
                    success: true,
                    message: 'Future contest fetched successfully',
                    contests: formattedContest
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'No future contests found.',
                });
            }

        }
        else {
            // API did not return success
            res.status(500).json({
                success: false,
                message: 'Failed to fetch contest data from the API.',
            });
        }
    }
    catch (error) {
        console.error(error);
        // Handle any errors that occur during the process
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching contests.',
        });
    }
}

// export const fetchUserNameExists = async (req, res) => {
//   try {
//     const { username } = req.params;
//     // console("Fetching for username:", username);

//     if (!username) {
//       return res.status(400).json({ error: 'Username is required in the request body.' });
//     }

//     const url = `https://www.codechef.com/users/${username}`;
//     let browser;
//     let puppeteer;
//     let chrome;

//     if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//       // console("Running on AWS Lambda/Vercel environment");
      
//       // Dynamically import modules and use their default exports
//       chrome = (await import("chrome-aws-lambda")).default;
//       puppeteer = (await import("puppeteer-core")).default;

//       // Get the Chromium executable path
//       const execPath = await chrome.executablePath;
//       if (!execPath) {
//         console.error("Chromium executablePath not found");
//         throw new Error("Chromium executablePath not found");
//       }
//       // console("Chromium executablePath:", execPath);

//       browser = await puppeteer.launch({
//         args: [...chrome.args, '--no-sandbox', '--disable-setuid-sandbox'],
//         defaultViewport: chrome.defaultViewport,
//         executablePath: execPath,
//         headless: true,
//       });
//     } else {
//       // console("Running locally");
//       puppeteer = (await import("puppeteer")).default;
//       browser = await puppeteer.launch({
//         headless: true,
//         args: ["--no-sandbox", "--disable-setuid-sandbox"],
//       });
//     }

//     const page = await browser.newPage();
//     // console("Navigating to URL:", url);
//     await page.goto(url, { waitUntil: 'networkidle2' });
//     // console("Page loaded");

//     // Check if the profile exists
//     const pageContent = await page.content();
//     if (
//       pageContent.includes("The user you are looking for does not exist") ||
//       !(await page.$(".user-details-container"))
//     ) {
//       await browser.close();
//       return res.status(200).json({
//         success: false,
//         message: "CodeChef account not found for the given username.",
//       });
//     }

//     // Wait for table selector (ignore timeout errors)
//     await page.waitForSelector("#rankContentDiv .dataTable tbody tr", { timeout: 5000 }).catch(() => {});
//     const html = await page.content();
//     await browser.close();

//     const dom = new JSDOM(html);
//     const document = dom.window.document;
//     const rows = document.querySelectorAll("#rankContentDiv .dataTable tbody tr");
//     // console("Rows found:", rows.length);

//     let firstProblemInfo = "No solved problems found";
//     // Loop through rows to extract the first solved problem
//     for (let row of rows) {
//       const problem = row.querySelector("td:nth-child(2) a")?.textContent.trim();
//       if (problem) {
//         firstProblemInfo = problem;
//         break;
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: 'First problem fetched successfully',
//       problemsolved: firstProblemInfo
//     });

//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching contests.',
//     });
//   }
// };



export const AddCodeChefAccount = async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // console("Email:", email);

        // Find the user by email
        const findUser = await User.findOne({ email }).exec();

        if (!findUser) {
            // console("User not found in the database.");
            return res.status(400).json({ message: "User not exists in database" });
        }

        // Check if the CodeChef user already exists in the database
        const existingUser = await CodeChefUser.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "CodeChef account already exists in the database" });
        }

        // const url = `https://www.codechef.com/users/${username}`;

        // // Fetch HTML content of the CodeChef profile page
        // const response = await axios.get(url);
        // const dom = new JSDOM(response.data);
        // const document = dom.window.document;

        // // Extract number of problems solved
        // const problemsSolvedElement = document.querySelector(".rating-data-section.problems-solved h3");
        // const problemsSolved = problemsSolvedElement ? problemsSolvedElement.textContent.trim() : "Not found";

        // // console(`Problems Solved: ${problemsSolved}`);

        // Fetch CodeChef profile data
        const profilePromise = axios.get(`${process.env.codechef_api_user}/${username}`).catch(() => null);
        const [profileRes] = await Promise.all([profilePromise]);

        const profileData = profileRes?.data || null;

        if (!profileData) {
            return res.status(400).json({ message: "Failed to fetch user data from CodeChef APIs" });
        }

        const simplifiedRatingData = profileData.ratingData.map(entry => ({
            name: entry.name,
            end_date: entry.end_date,
            rating: entry.rating,
            rank: entry.rank
        }));

        // Categorizing heat map activity by year
        let year2022 = [], year2023 = [], year2024 = [], year2025 = [];

        profileData.heatMap.forEach(item => {
            const year = item.date.split("-")[0]; // Extract year from date
            if (year === "2022") year2022.push(item);
            else if (year === "2023") year2023.push(item);
            else if (year === "2024") year2024.push(item);
            else if (year === "2025") year2025.push(item);
        });

        // Create a new CodeChefUser document
        const newCodeChef = new CodeChefUser({
            username: username,
            // problemSolved: parseInt(problemsSolved.match(/\d+/)[0], 10),
            countryRank: profileData.countryRank,
            globalRank: profileData.globalRank,
            countryName: profileData.countryName,
            currentRating: profileData.currentRating,
            highestRating: profileData.highestRating,
            stars: profileData.stars,
            contests: simplifiedRatingData.length > 0 ? simplifiedRatingData : undefined,
            ActivityCalender2022: year2022.length > 0 ? year2022 : undefined,
            ActivityCalender2023: year2023.length > 0 ? year2023 : undefined,
            ActivityCalender2024: year2024.length > 0 ? year2024 : undefined,
            ActivityCalender2025: year2025.length > 0 ? year2025 : undefined,
        });

        await newCodeChef.save();

        findUser.CodeChef = newCodeChef._id;
        await User.findByIdAndUpdate(findUser._id, { CodeChef: newCodeChef._id });

        return res.status(201).json({ message: "User data stored successfully", success: true, data: newCodeChef });

    } catch (error) {
        console.error("Error storing CodeChef user data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const fetchCodeChefAccount = async (req, res) => {
    try {
        const { username } = req.params;
        const updatedData = await updateCodeChefUserData(username);
        return res.status(200).json({
            message: "User data updated successfully",
            data: updatedData,
        });
    } catch (error) {
        console.error("Error updating CodeChef user data:", error);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};


export const fetchCodeChefFromDB = async (req, res) => {
    try {
        const { codechefid } = req.params;
        let existingUser = await CodeChefUser.findById(codechefid).exec();

        if (!existingUser) {
            // console("CodeChef user not found, creating a new one.");
            return res.status(400).json({
                success: false,
                message: "CodeChef user not found"
            });
        } else {
            return res.status(200).json({
                data: existingUser,
                success: true,
                message: "CodeChef user  found"
            });
        }
    } catch (error) {
        console.error("Error storing LeetCode user data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const deleteCodeChefUser = async (req, res) => {
    try {
        const { codechefid } = req.params; // The LeetCodeUser ID to delete

        // Delete the LeetCodeUser document
        const deletedLeetCodeUser = await CodeChefUser.findByIdAndDelete(codechefid);
        if (!deletedLeetCodeUser) {
            return res.status(404).json({ success: false, message: 'LeetCodeUser not found.' });
        }

        await User.findOneAndUpdate(
            { CodeChef: codechefid },
            { $unset: { CodeChef: "" } } // Remove the field
        );

        return res.status(200).json({ success: true, message: 'LeetCodeUser deleted and reference removed from User.' });
    } catch (error) {
        console.error('Error deleting LeetCodeUser:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
