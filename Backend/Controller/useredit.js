import User from'../Models/User.js'
export const updateUserProfile = async (req, res) => {
  const { username, name, email, mobileno, bio,userId, location, education, profilePicture } = req.body;

  try {
    // Find the user by their ID (from the token)
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the user's profile fields if they are provided
    if (username) user.username = username;
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobileno) user.mobileno = mobileno;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (education) user.education = education;
    if (profilePicture) user.profilePicture = profilePicture;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'User profile updated successfully.', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

