// import puppeteer from 'puppeteer';
import axios from 'axios';
import User from '../../Models/User.js';
import CodeChefUser from '../../Models/CodeChef.js';


// const scrapeProblemsSolved = async (url, timeout = 10000) => {
//   try {
//     return await Promise.race([
//       (async () => {
//         const browser = await puppeteer.launch({ headless: true });
//         const page = await browser.newPage();
//         await page.goto(url, { waitUntil: 'domcontentloaded' });
//         const problemsSolved = await page.evaluate(() => {
//           const h3Elements = document.querySelectorAll(".rating-data-section.problems-solved h3");
//           // Check if we have enough elements; otherwise default to "0"
//           return h3Elements.length > 3 ? h3Elements[3].innerText.trim() : "0";
//         });
//         await browser.close();
//         const match = problemsSolved.match(/\d+/);
//         return match ? parseInt(match[0], 10) : 0;
//       })(),
//       new Promise((resolve) => setTimeout(() => resolve(0), timeout))
//     ]);
//   } catch (error) {
//     console.error("Error in scrapeProblemsSolved helper:", error);
//     return 0;
//   }
// };


export const updateCodeChefUserData = async (username) => {
  if (!username) {
    throw new Error("Username is required");
  }
  
  // Fetch the user from the DB
  const findUser = await User.findOne({ username }).exec();
  if (!findUser) {
    throw new Error("User does not exist in the database");
  }
  
  // Ensure the user has linked a CodeChef account
  if (!findUser.CodeChef) {
    throw new Error("CodeChef account not linked with this user");
  }
  
  // Find the associated CodeChef user document
  const existingCodeChefUser = await CodeChefUser.findById(findUser.CodeChef);
  if (!existingCodeChefUser) {
    throw new Error("CodeChef user data not found");
  }
  
  // Build the CodeChef profile URL for scraping
  // const url = `https://www.codechef.com/users/${existingCodeChefUser.username}`;
  
  // Scrape problems solved (with a 10-second timeout)
  // const problemsSolved = await scrapeProblemsSolved(url, 10000);
  
  // Fetch CodeChef profile data via API
  const profileUrl = `${process.env.codechef_api_user}/${existingCodeChefUser.username}`;
  const profileResponse = await axios.get(profileUrl).catch(() => null);
  const profileData = profileResponse?.data || null;
  if (!profileData) {
    throw new Error("Failed to fetch user data from CodeChef APIs");
  }
  
  // Process rating data
  const simplifiedRatingData = Array.isArray(profileData.ratingData)
    ? profileData.ratingData.map(entry => ({
        name: entry.name,
        end_date: entry.end_date,
        rating: entry.rating,
        rank: entry.rank
      }))
    : [];
  
  // Categorize heat map activity by year
  let year2022 = [], year2023 = [], year2024 = [], year2025 = [];
  if (Array.isArray(profileData.heatMap)) {
    profileData.heatMap.forEach(item => {
      const year = item.date.split("-")[0]; // Extract year from date
      if (year === "2022") year2022.push(item);
      else if (year === "2023") year2023.push(item);
      else if (year === "2024") year2024.push(item);
      else if (year === "2025") year2025.push(item);
    });
  }
  
  // Update the CodeChefUser document fields
  // existingCodeChefUser.problemSolved = problemsSolved;
  existingCodeChefUser.countryRank = profileData.countryRank;
  existingCodeChefUser.globalRank = profileData.globalRank;
  existingCodeChefUser.countryName = profileData.countryName;
  existingCodeChefUser.currentRating = profileData.currentRating;
  existingCodeChefUser.highestRating = profileData.highestRating;
  existingCodeChefUser.stars = profileData.stars;
  existingCodeChefUser.contests = simplifiedRatingData.length > 0 ? simplifiedRatingData : undefined;
  existingCodeChefUser.ActivityCalender2022 = year2022.length > 0 ? year2022 : undefined;
  existingCodeChefUser.ActivityCalender2023 = year2023.length > 0 ? year2023 : undefined;
  existingCodeChefUser.ActivityCalender2024 = year2024.length > 0 ? year2024 : undefined;
  existingCodeChefUser.ActivityCalender2025 = year2025.length > 0 ? year2025 : undefined;
  
  // Save the updated document
  await existingCodeChefUser.save();
  
  // Optionally, update the User document with the CodeChefUser id (if needed)
  await User.findByIdAndUpdate(findUser._id, { CodeChef: existingCodeChefUser._id });
  
  return existingCodeChefUser;
};
