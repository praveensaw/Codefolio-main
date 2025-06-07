import axios from 'axios';
import dotenv from 'dotenv';
import GitHubUser from "../Models/GitHub.js";
import User from "../Models/User.js";
import { updateGitHubUserData } from './Helper/Github.js';
dotenv.config();

// --------------------------------------
// Basic Controller: Create a GitHubUser Document
// --------------------------------------
export const addGitHubBasics = async (req, res) => {
  try {
    const { email, username } = req.body;
    const findUser = await User.findOne({ email }).exec();

    if (!findUser) {
      // console("User not found in the database.");
      return res.status(400).json({ success: false, message: "User does not exist in database" });
    }

    // Check if the GitHub account already exists in the database
    const existingUser = await GitHubUser.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "GitHub account already exists in the database" });
    }

    const profilePromise = axios.get(`${process.env.github_api1}/${username}`).catch(() => null);
    const repoPromise = axios.get(`${process.env.github_api1}/${username}/repos`).catch(() => null);
    const followersPromise = axios.get(`${process.env.github_api1}/${username}/followers`).catch(() => null);
    const followingPromise = axios.get(`${process.env.github_api1}/${username}/following`).catch(() => null);

    const [profileRes, reposRes, followersRes, followingRes] = await Promise.all([
      profilePromise,
      repoPromise,
      followersPromise,
      followingPromise
    ]);

    if (!profileRes || !reposRes) {
      return res.status(500).json({ success: false, message: "Error fetching GitHub data" });
    }

    const profileData = profileRes.data;
    const reposData = reposRes.data;

    // Process each repository: fetch contributors and language statistics.
    const processedRepos = await Promise.all(
      reposData.map(async (repo) => {
        let collaborators = [];
        try {
          const contributorsRes = await axios.get(repo.contributors_url);
          const contributorsData = contributorsRes.data;
          collaborators = contributorsData.map((contributor) => ({
            name: contributor.login,
            avatar_col: contributor.avatar_url
          }));
        } catch (error) {
          console.error(`Error fetching contributors for repo ${repo.name}:`, error.message);
        }

        let languagesData = {};
        try {
          const languagesRes = await axios.get(repo.languages_url);
          languagesData = languagesRes.data; // storing as an object
        } catch (error) {
          console.error(`Error fetching languages for repo ${repo.name}:`, error.message);
        }

        return {
          name: repo.name,
          description: repo.description,
          languages: Object.keys(languagesData),
          live_link: repo.homepage || "",
          git_link: repo.svn_url,
          starred: repo.stargazers_count || 0,
          commits: 0,
          collaborators: collaborators
        };
      })
    );

    const followersCount = followersRes && Array.isArray(followersRes.data) ? followersRes.data.length : 0;
    const followingCount = followingRes && Array.isArray(followingRes.data) ? followingRes.data.length : 0;

    // console(processedRepos);
    const newGitHubUser = new GitHubUser({
      username: profileData.login,
      avatar: profileData.avatar_url,
      url: profileData.html_url,
      repos: processedRepos,
      collaborated_repos: [],  // to be updated later
      submissions: {},         // to be updated later
      //   active_days: 0,          // to be updated later
      bio: profileData.bio,
      followers: followersCount,
      following: followingCount
    });

    await newGitHubUser.save();
    findUser.Github = newGitHubUser._id;
    await User.findByIdAndUpdate(findUser._id, { Github: newGitHubUser._id });
    res.status(201).json({
      success: true,
      message: "Basic GitHub data saved successfully",
      data: newGitHubUser
    });
  } catch (error) {
    success: false,
      console.error("Error in addGitHubBasics:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const formatDate = (dateString) => {
  const d = new Date(dateString);
  const year = d.getFullYear().toString().slice(-2); // last two digits
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const updateGitHubAdvanced = async (req, res) => {
  try {
    const { pat, username } = req.body;

    const findUser = await User.findOne({ username }).exec();

    if (!findUser) {
      // console("User not found in the database.");
      return res.status(400).json({ success: false, message: "User does not exist in database" });
    }

    // Find the existing GitHub user document.
    const existingUser = await GitHubUser.findById(findUser.Github);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "GitHub user not found. Please create basic data first." });
    }

    // GraphQL query to fetch contributions and collaborated repositories.
    const query = `
      query ($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
          repositoriesContributedTo(first: 100, includeUserRepositories: false) {
            nodes {
              name
              description
              homepageUrl
              sshUrl
              url
              stargazerCount
              visibility
              languages(first: 5) {
                nodes {
                  name
                }
              }
              collaborators(first: 5) {
                nodes {
                  login
                  avatarUrl
                }
              }
              defaultBranchRef {
                target {
                  ... on Commit {
                    history {
                      totalCount
                    }
                  }
                }
              }
            }
          }
          starredRepositories {
            totalCount
          }
        }
      }
    `;
    const variables = { login: existingUser.username };

    const graphqlResponse = await axios.post(
      'https://api.github.com/graphql',
      { query, variables },
      {
        headers: {
          'Authorization': `bearer ${pat}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { data } = graphqlResponse.data;
    if (!data || !data.user) {
      return res.status(404).json({ success: false, message: "GitHub user not found via GraphQL" });
    }
    const userData = data.user;

    // Prepare submissions grouped by year as an object.
    const submissionsByYear = {
      "2024": [],
      "2025": [],
      "2023": [],
      "2022": []
    };

    let totalContribution = 0;
    userData.contributionsCollection.contributionCalendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        if (day.contributionCount > 0) { // only include days with contributions > 0
          const year = new Date(day.date).getFullYear().toString();
          if (submissionsByYear.hasOwnProperty(year)) {
            submissionsByYear[year].push({
              date: formatDate(day.date), // formatted as "YY-MM-DD"
              submissions: day.contributionCount,
            });
          }
          totalContribution += day.contributionCount;
        }
      });
    });

    // console(submissionsByYear)

    // Process collaborated repositories, filtering only public ones.
    const collaboratedRepos = userData.repositoriesContributedTo.nodes
      .filter(repo => repo.visibility === "PUBLIC")
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        languages: repo.languages.nodes.map(lang => lang.name),
        live_link: repo.homepageUrl || "",
        git_link: repo.svn_url || repo.url,
        starred: repo.stargazerCount || 0,
        // Total commits from defaultBranchRef.
        commits: repo.defaultBranchRef?.target?.history?.totalCount || 0,
        collaborators: repo.collaborators.nodes.map(collab => ({
          name: collab.login,
          avatar_col: collab.avatarUrl
        }))
      }));

    // Calculate active_days by counting days with contributions.
    let activeDays = 0;
    userData.contributionsCollection.contributionCalendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        if (day.contributionCount > 0) activeDays++;
      });
    });

    // Total starred repositories count.
    const starredRepos = userData.starredRepositories.totalCount;

    // Update the existing GitHub user document with advanced data.
    existingUser.collaborated_repos = collaboratedRepos;
    existingUser.submissions = {
      submissionCalendar2024: submissionsByYear["2024"],
      submissionCalendar2025: submissionsByYear["2025"],
      submissionCalendar2023: submissionsByYear["2023"],
      submissionCalendar2022: submissionsByYear["2022"]
    };
    existingUser.active_days = activeDays;
    existingUser.starred_repos = starredRepos;
    existingUser.auth = true;
    existingUser.pat=pat;
    existingUser.totalContributions = totalContribution;

    await existingUser.save();
    res.status(200).json({
      success: true,
      message: "Advanced GitHub data updated successfully",
      data: existingUser
    });
  } catch (error) {
    console.error("Error in updateGitHubAdvanced:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


export const fetchFromDB = async (req, res) => {
  try {
    const { geetid } = req.params;
    let existingUser = await GitHubUser.findById(geetid).exec();

    if (!existingUser) {
      // console("GitHubUser user not found, creating a new one.");
      return res.status(400).json({
        success: false,
        message: "GitHubUser user not found"
      });
    } else {
      return res.status(200).json({
        data: existingUser,
        success: true,
        message: "GitHubUser user  found"
      });
    }
  } catch (error) {
    console.error("Error storing GitHubUser user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export const updateGitHubData = async (req, res) => {
  try {
    // Get username from request parameters
    const { username } = req.params;
    const updatedData = await updateGitHubUserData(username);
    // // console(updatedData)
    return res.status(200).json({
      success: true,
      message: "GitHub data updated successfully",
      data: updatedData
    });
  } catch (error) {
    console.error("Error in updateGitHubData:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const deleteGithubUser = async (req, res) => {
  try {
    const { geetid } = req.params; // The LeetCodeUser ID to delete

    // Delete the LeetCodeUser document
    const deletedGithubUser = await GitHubUser.findByIdAndDelete(geetid);
    if (!deletedGithubUser) {
      return res.status(404).json({ success: false, message: 'LeetCodeUser not found.' });
    }

    await User.findOneAndUpdate(
      { Github: geetid },
      { $unset: { Github: "" } } // Remove the field
    );

    return res.status(200).json({ success: true, message: 'LeetCodeUser deleted and reference removed from User.' });
  } catch (error) {
    console.error('Error deleting LeetCodeUser:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};