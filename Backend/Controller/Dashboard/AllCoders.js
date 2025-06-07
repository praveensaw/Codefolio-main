import User from '../../Models/User.js';

// Helper function to calculate total LeetCode problems solved
const getTotalProblemsSolved = (leetCodeUser) => {
    return (leetCodeUser?.profile?.easySolved || 0) +
           (leetCodeUser?.profile?.mediumSolved || 0) +
           (leetCodeUser?.profile?.hardSolved || 0);
};

// Controller to fetch all users and their coding stats
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .populate('LeetCode', 'profile')
            .populate('GeeksforGeeks', 'contestRating')
            .populate('CodeChef', 'problemSolved')
            .populate('CodeForces', 'problemSolved')
            .populate('Github', 'totalContributions');

        const formattedUsers = users.map(user => {
            const leetcode = getTotalProblemsSolved(user?.LeetCode);
            const gfg = parseInt(user?.GeeksforGeeks?.contestRating[1]) || 0;
            const codechef = user?.CodeChef?.problemSolved || 0;
            const codeforces = user?.CodeForces?.problemSolved || 0;
            const github = user?.Github?.totalContributions || 0;

            return {
                username: user.username,
                name: user.name,
                email: user.email,
                totalActiveDays: user.totalActiveDays || 0,
                college: user.education?.college || "Not Provided",
                LeetCode: leetcode,
                GeeksforGeeks: gfg,
                CodeChef: codechef,
                CodeForces: codeforces,
                Github: github,
                solved: leetcode + gfg + codechef + codeforces,
                branch: user.education?.branch || "Not Provided",
                position: user.position || "Not Provided"
            };
        });

        res.status(200).json({
            success: true,
            count: formattedUsers.length,
            data: formattedUsers
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};