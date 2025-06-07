import axios from 'axios';
import { JSDOM } from 'jsdom';
import GeeksforGeeksUser from '../Models/GeeksforGeeks.js'; // adjust the path as needed
import User from '../Models/User.js';
import { updateGFGUserData } from './Helper/GeeksForGeeks.js';

export const addGFG = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required.' });
    }

    const findUser = await User.findOne({ email }).exec();

    if (!findUser) {
      // console("User not found in the database.");
      return res.status(400).json({ success: false, message: "User not exists in database" });
    }

    let existingProfile = await GeeksforGeeksUser.findOne({ username });

    if (existingProfile) {
      return res.status(400).json({ success: false, message: 'User already exists in database', data: existingProfile });
    }

    // Fetch HTML from GeeksForGeeks
    const response = await axios.get(`https://www.geeksforgeeks.org/user/${username}`);
    if (response.status !== 200) {
      return res.status(404).json({ success: false, message: 'GFG user not found.' });
    }

    const { data } = response;
    const dom = new JSDOM(data);
    const document = dom.window.document;

    // Function to safely extract values
    const getText = (selector) => document.querySelector(selector)?.textContent.trim() || null;

    const getStars = () => document.querySelectorAll('.profilePicSection_head_stars__JrrGz i').length || 0;

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

    // Extract Data
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
      .slice(0, 15); // Get only the top 15 problems



    const difficultyLevels = getDifficultyLevels();

    // Store Data in MongoDB
    const GeeksforGeeks = new GeeksforGeeksUser({
      username: userHandle || username,
      stars,
      education: education || 'Not Available',
      rank: rank || 'Not Available',
      skills: skills || 'Not Available',
      contestRating,
      streak: streak || '0',
      contestAttended: contestAttended || '0',
      globalRank,
      percentageInfo: percentageInfo || 'Not Available',
      problemNames,
      difficultyLevels,
      contestDetails
    });

    await GeeksforGeeks.save();
    findUser.GeeksforGeeks = GeeksforGeeks._id;
    await User.findByIdAndUpdate(findUser._id, { GeeksforGeeks: GeeksforGeeks._id });

    return res.status(201).json({
      success: true,
      message: "User data successfully fetched and stored",
      data: GeeksforGeeks
    });

  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching user data",
    });
  }
};

export const fetchGFGfromDB = async (req, res) => {
  try {
    const { gfgid } = req.params;
    let existingUser = await GeeksforGeeksUser.findById(gfgid).exec();

    if (!existingUser) {
      // console("GeeksforGeeks user not found, creating a new one.");
      return res.status(400).json({
        success: false,
        message: "LeetCode user not found"
      });
    } else {
      return res.status(200).json({
        data: existingUser,
        success: true,
        message: "GeeksforGeeks user  found"
      });
    }
  } catch (error) {
    console.error("Error storing LeetCode user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const fetchGFG = async (req, res) => {
  try {
    const { username } = req.params;
    const updatedGFGProfile = await updateGFGUserData(username);
    return res.status(200).json({
      success: true,
      message: "User data successfully updated",
      data: updatedGFGProfile
    });
  } catch (error) {
    console.error("Error fetching GFG user data:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching user data"
    });
  }
};



export const deleteGeekforGeeksUser = async (req, res) => {
    try {
        const { geekid } = req.params; // The LeetCodeUser ID to delete
    
        // Delete the LeetCodeUser document
        const deletedGeeksforGeeksUser = await GeeksforGeeksUser.findByIdAndDelete(geekid);
        if (!deletedGeeksforGeeksUser) {
          return res.status(404).json({ success: false, message: 'LeetCodeUser not found.' });
        }
    
        await User.findOneAndUpdate(
          { GeeksforGeeks: geekid },
          { $unset: { GeeksforGeeks: "" } } // Remove the field
        );
    
        return res.status(200).json({ success: true, message: 'LeetCodeUser deleted and reference removed from User.' });
      } catch (error) {
        console.error('Error deleting LeetCodeUser:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
};
