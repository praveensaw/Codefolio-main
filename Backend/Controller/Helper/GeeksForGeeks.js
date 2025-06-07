import axios from 'axios';
import { JSDOM } from 'jsdom';
import User from '../../Models/User.js';
import GeeksforGeeksUser from '../../Models/GeeksforGeeks.js';

export const updateGFGUserData = async (username, timeout = 10000) => {
  if (!username) {
    throw new Error('Username is required.');
  }

  // Find the user in the database
  const findUser = await User.findOne({ username }).exec();
  if (!findUser) {
    throw new Error("User does not exist in the database");
  }

  // Ensure the user has a linked GFG profile
  if (!findUser.GeeksforGeeks) {
    throw new Error("GFG does not exist in the database");
  }

  // Find the existing GFG profile document
  const gfgProfile = await GeeksforGeeksUser.findById(findUser.GeeksforGeeks);
  if (!gfgProfile) {
    throw new Error("GFG user data not found");
  }

  // Build the GFG profile URL
  const url = `https://www.geeksforgeeks.org/user/${gfgProfile.username}`;

  // Fetch the profile page with a timeout to avoid long delays
  const response = await axios.get(url, { timeout }).catch(() => null);
  if (!response || response.status !== 200) {
    throw new Error("GFG user not found or request timed out");
  }

  const { data } = response;
  const dom = new JSDOM(data);
  const document = dom.window.document;

  // Helper functions for safe extraction:
  const getText = (selector) =>
    document.querySelector(selector)?.textContent.trim() || null;

  const getStars = () =>
    document.querySelectorAll('.profilePicSection_head_stars__JrrGz i').length || 0;

  const getContestDetails = () => {
    return Array.from(document.querySelectorAll(".contestDetailsCard_head_detail--title__ngWg9"))
      .map(el => el.textContent.trim());
  };

  const getGlobalRank = () => {
    const elements = document.querySelectorAll(".contestDetailsCard_head_detail--title__ngWg9");
    for (const el of elements) {
      if (el.textContent.trim() === "Global Rank") {
        return el.parentElement?.querySelector(".contestDetailsCard_head_detail--text__NG_ae")?.textContent.trim() || 'Not Available';
      }
    }
    return 'Not Available';
  };

  const getDifficultyLevels = () => {
    return Array.from(document.querySelectorAll('.problemNavbar_head__cKSRi .problemNavbar_head_nav__a4K6P'))
      .map(navItem => {
        const textElement = navItem.querySelector('.problemNavbar_head_nav--text__UaGCx');
        const textContent = textElement ? textElement.textContent.trim() : null;
        const matches = textContent ? textContent.match(/([A-Za-z]+)\s\((\d+)\)/) : null;
        return matches ? { difficulty: matches[1], solved: parseInt(matches[2], 10) } : null;
      })
      .filter(item => item !== null);
  };

  // Extract data using helper functions.
  const userHandle = getText('.profilePicSection_head_userHandle__oOfFy');
  const stars = getStars();
  const education = getText('.educationDetails_head_left--text__tgi9I');
  const rank = getText('.educationDetails_head_left_userRankContainer--text__wt81s b');
  const skills = getText('.educationDetails_head_right--text__lLOHI');
  const contestAttended = getText('.contestDetailsCard_head_detail--text__NG_ae');
  const contestDetails = getContestDetails();
  const globalRank = getGlobalRank();
  const contestRating = Array.from(document.querySelectorAll('.scoreCard_head_left--score__oSi_x'))
    .map(el => el.textContent.trim());
  const streak = getText('.circularProgressBar_head_mid_streakCnt__MFOF1');
  const percentageInfo = getText('.contestDetailsCard_head_card__2xPdL p');
  const problemNames = Array.from(document.querySelectorAll('.problemList_head__FfRAd ul li'))
    .map(li => li.querySelector('a')?.textContent.trim())
    .filter(name => name !== null)
    .slice(0, 15); // Limit to top 15 problems
  const difficultyLevels = getDifficultyLevels();

  // Update the GFG profile document fields.
  gfgProfile.username = userHandle || gfgProfile.username;
  gfgProfile.stars = stars;
  gfgProfile.education = education || 'Not Available';
  gfgProfile.rank = rank || 'Not Available';
  gfgProfile.skills = skills || 'Not Available';
  gfgProfile.contestRating = contestRating;
  gfgProfile.streak = streak || '0';
  gfgProfile.contestAttended = contestAttended || '0';
  gfgProfile.globalRank = globalRank;
  gfgProfile.percentageInfo = percentageInfo || 'Not Available';
  gfgProfile.problemNames = problemNames;
  gfgProfile.difficultyLevels = difficultyLevels;
  gfgProfile.contestDetails = contestDetails;

  // Save the updated profile.
  await gfgProfile.save();
  return gfgProfile;
};
