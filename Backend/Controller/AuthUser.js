import User from "../Models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import cloudinary from 'cloudinary'
import LeetCodeUser from "../Models/LeetCode.js";
import CodeforcesUser from "../Models/CodeForces.js";
import CodeChefUser from "../Models/CodeChef.js";
import GeeksforGeeksUser from "../Models/GeeksforGeeks.js";
import GitHubUser from "../Models/GitHub.js";
dotenv.config(); 

export const Signup = async (req, res) => {
    try {
        const { username, name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            })
        }

        // Secured password 
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }


        let users = await User.create({
            name, email, password: hashedPassword, username
        });

        await users.save();

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: users
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be register,Please try again later",
        })
    }
}

// Login
export const Login = async (req, res) => {
    try {
        // console(req.body)
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            })
        }

        // check for register user 
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist",
            });
        }

        // Verify password & generate a JWT token

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };


        if (await bcrypt.compare(password, user.password)) {
            // password match
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully"
            });
        }
        else {
            return res.status(403).json({
                success: false,
                message: "Password does not match",
            })
        }
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Login false"
        })
    }
}

export const verifyPassword = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({ success: false, message: "ID and password are required." });
    }

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.status(200).json({ success: true, message: "Password matched." });
    } else {
      return res.status(200).json({ success: false, message: "Invalid password." });
    }
  } catch (error) {
    console.error("Error in verifyPassword controller:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};


export const getAllStat = async (req, res) => {
  try {
    const [
      leetcodeUsers,
      codeforcesUsers,
      codechefUsers,
      geeksforGeeksUsers,
      githubUsers,
      users,
    ] = await Promise.all([
      LeetCodeUser.find({}),
      CodeforcesUser.find({}),
      CodeChefUser.find({}),
      GeeksforGeeksUser.find({}),
      GitHubUser.find({}),
      User.find({}),
    ]);

    const codechefSolved = codechefUsers
      .map((user) => user.problemSolved || 0)
      .reduce((acc, cur) => acc + parseInt(cur), 0);

    const codeforcesSolved = codeforcesUsers
      .map((user) => user.problemSolved || 0)
      .reduce((acc, cur) => acc + parseInt(cur), 0);

    const leetcodeSolved = leetcodeUsers
      .map((user) => user.profile.totalSolved || 0)
      .reduce((acc, cur) => acc + parseInt(cur), 0);

    const geeksforgeeksSolved = 
    geeksforGeeksUsers.map((user) => (user.contestRating ? user.contestRating[1] || 0 : 0))
      .reduce((acc, cur) => acc + parseInt(cur), 0);

    // console(geeksforgeeksSolved);
    
    const totalProblemSolved =
      codechefSolved +
      codeforcesSolved +
      leetcodeSolved +
      geeksforgeeksSolved;

    // Sum up total contributions from GitHub users
    const totalContribution = githubUsers
      .map((user) => user.totalContributions || 0)
      .reduce((acc, cur) => acc + cur, 0);

      // console(totalProblemSolved)

    res.status(200).json({
      success: true,
      active: users.length,
      totalProblemSolved,
      totalContribution,
    });
  } catch (error) {
    console.error("Error fetching all stats:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const checkUsername = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ error: 'Username parameter is required' });
        }

        const user = await User.findOne({ username: username.toLowerCase() });

        if (user) {
            return res.status(200).json({ available: false });
        }

        return res.status(200).json({ available: true });
    } catch (error) {
        console.error('Error checking username availability:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUser=async(req,res)=>{
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Username parameter is required' });
        }

        const user = await User.findById(id);

        if (user) {
            return res.status(200).json({ 
                data:user
             });
        }

        return res.status(200).json({ 
            data:null
         });
    } catch (error) {
        console.error('Error checking username availability:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const checkUser=async(req,res)=>{
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ error: 'Username parameter is required' });
        }

        const user = await User.findOne({username});

        if (user) {
            return res.status(200).json({ 
                exists:true,
                data:user
             });
        }

        return res.status(200).json({ 
            exists:false,
            data:null
         });
    } catch (error) {
        console.error('Error checking username availability:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getUserbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Send user data (or filter fields as needed)
    return res.json({
        success:true,

    });
  } catch (error) {
    console.error('Error in getUser:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


export const editUserbyId = async (req, res) => {
  const { id } = req.params;
  // Destructure expected fields from request body
  const {
    username,
    name,
    email,
    mobileno,
    profilePicture,
    bio,
    city,
    country,
    state,
    college,
    branch,
    degree,
    gryear,
    website,
    skills,
    position,
    avgScore,
    userProfile,
    gender,
    birthdate,
    role,
    imageData,
    linkedin,
    geeksforgeeks,
    github,
    leetcode,
    codeforces,
    codechef,
    twitter
  } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let newImageUrl=user.profilePicture;
    if (imageData && imageData.startsWith("data:image")) {
        const base64Image = imageData.split(";base64,").pop();
        const uploadResponse = await cloudinary.uploader.upload(
            `data:image/png;base64,${base64Image}`,
            {
                folder: "CodeVerse",
                use_filename: true,
                unique_filename: true,
                quality: "auto:best",
                format: "auto",
                width: 374,
                height: 305,
                crop: "fit",
            }
        );
        newImageUrl = uploadResponse.secure_url;
    }

    if(imageData!==undefined) user.profilePicture = newImageUrl;    
    if (username !== undefined) user.username = username;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (mobileno !== undefined) user.mobileno = parseInt(mobileno)
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (position !== undefined) user.position = position;
    if (website !== undefined) user.website = website;
    if (gender !== undefined) user.gender = gender;
    if (birthdate !== undefined) user.birthdate = birthdate;
    if (role !== undefined) user.role = role;
    if(city!==undefined) user.location.city=city;
    if(country!==undefined) user.location.country=country;
    if(state!==undefined) user.location.state=state;
    if(college!==undefined) user.education.college=college;
    if(branch!==undefined) user.education.branch=branch;
    if(degree!==undefined) user.education.degree=degree;
    if(gryear!==undefined) user.education.gryear=gryear;
    if(linkedin!==undefined) user.userProfile.linkedin=linkedin;
    if(geeksforgeeks!==undefined) user.userProfile.geeksforgeeks=geeksforgeeks;
    if(leetcode!==undefined) user.userProfile.leetcode=leetcode;
    if(codechef!==undefined) user.userProfile.codechef=codechef;
    if(codeforces!==undefined) user.userProfile.codeforces=codeforces;
    if(twitter!==undefined) user.userProfile.twitter=twitter;
    if(github!==undefined) user.userProfile.github=github;


    // Update avgScore object (if provided)
    if (avgScore) {
      user.avgScore = {
        rank: avgScore.rank !== undefined ? avgScore.rank : user.avgScore.rank,
        score: avgScore.score !== undefined ? avgScore.score : user.avgScore.score,
        totalActiveDays: avgScore.totalActiveDays !== undefined ? avgScore.totalActiveDays : user.avgScore.totalActiveDays,
        stars: avgScore.stars !== undefined ? avgScore.stars : user.avgScore.stars,
        graph: avgScore.graph && avgScore.graph.activedates 
          ? { activedates: avgScore.graph.activedates }
          : user.avgScore.graph
      };
    }

    const updatedUser = await user.save();
    return res.json({
        success:true,
        updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

import Contactus from "../Models/Contact.js";  // Ensure correct path

export const submitContactForm = async (req, res) => {
    try {
       // console("Received Request Body:", req.body);

        const { fullName, email, message } = req.body;

        if (!fullName || !email || !message) {
            return res.status(400).json({ error: "All fields required" });
        }

        const newContact = new Contactus({ fullName, email, message });

        // console.time("DB Save");
        await newContact.save();
        // console.timeEnd("DB Save");

        res.status(201).json({ success:true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error in submitContactForm:", error);
        res.status(500).json({ error: "Server Error" });
    }
};