import axios from 'axios';
import User from '../../Models/User.js';
import GitHubUser from '../../Models/GitHub.js';

const formatDate = (dateString) => {
  const d = new Date(dateString);
  const year = d.getFullYear().toString().slice(-2); // last two digits
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const fetchAuthData = async (githubUser) => {
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
  const variables = { login: githubUser.username };

  const graphqlResponse = await axios.post(
    'https://api.github.com/graphql',
    { query, variables },
    {
      headers: {
        'Authorization': `bearer ${githubUser.pat}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const data = graphqlResponse.data.data;
  if (data && data.user) {
    const userData = data.user;

    // Group contributions by year
    const submissionsByYear = {
      "2024": [],
      "2025": [],
      "2023": [],
      "2022": []
    };

    let totalContribution = 0;
    let activeDays = 0;

    userData.contributionsCollection.contributionCalendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        if (day.contributionCount > 0) { // include days with contributions > 0
          activeDays++;
          const year = new Date(day.date).getFullYear().toString();
          if (submissionsByYear.hasOwnProperty(year)) {
            submissionsByYear[year].push({
              date: formatDate(day.date),
              submissions: day.contributionCount,
            });
          }
          totalContribution += day.contributionCount;
        }
      });
    });

    // Process repositories that the user collaborated on (only public ones)
    const collaboratedRepos = userData.repositoriesContributedTo.nodes
      .filter(repo => repo.visibility === "PUBLIC")
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        languages: repo.languages.nodes.map(lang => lang.name),
        live_link: repo.homepageUrl || "",
        git_link: repo.svn_url || repo.url,
        starred: repo.stargazerCount || 0,
        commits: repo.defaultBranchRef?.target?.history?.totalCount || 0,
        collaborators: repo.collaborators.nodes.map(collab => ({
          name: collab.login,
          avatar_col: collab.avatarUrl
        }))
      }));

      // console(submissionsByYear["2025"]);


    // Update the GitHubUser document with advanced data.
    githubUser.collaborated_repos = collaboratedRepos;
    githubUser.submissions = {
      submissionCalendar2024: submissionsByYear["2024"],
      submissionCalendar2025: submissionsByYear["2025"],
      submissionCalendar2023: submissionsByYear["2023"],
      submissionCalendar2022: submissionsByYear["2022"]
    };
    githubUser.active_days = activeDays;
    githubUser.starred_repos = userData.starredRepositories.totalCount;
    githubUser.totalContributions = totalContribution;
    await githubUser.save();
  } else {
    // console("Authenticated GitHub data not found for user.");
  }
};


export const updateGitHubUserData = async (username) => {
  if (!username) {
    throw new Error("Username is required");
  }

  // Find the user document in the database
  const findUser = await User.findOne({ username }).exec();
  if (!findUser) {
    throw new Error("User does not exist in the database");
  }

  // Find the associated GitHubUser document
  const githubUser = await GitHubUser.findById(findUser.Github);
  if (!githubUser) {
    throw new Error("GitHub user not found. Please create basic data first.");
  }

  const ghUsername = githubUser.username;

  // Make unauthenticated API calls to GitHub for basic data
  const profilePromise = axios.get(`${process.env.github_api1}/${ghUsername}`).catch(() => null);
  const reposPromise = axios.get(`${process.env.github_api1}/${ghUsername}/repos`).catch(() => null);
  const followersPromise = axios.get(`${process.env.github_api1}/${ghUsername}/followers`).catch(() => null);
  const followingPromise = axios.get(`${process.env.github_api1}/${ghUsername}/following`).catch(() => null);

  const [profileRes, reposRes, followersRes, followingRes] = await Promise.all([
    profilePromise,
    reposPromise,
    followersPromise,
    followingPromise
  ]);

    if (githubUser.auth && githubUser.pat) {
      await fetchAuthData(githubUser);
    }
    // return githubUser;


  const profileData = profileRes.data;
  const reposData = reposRes.data;

  // Process repositories to extract needed data
  const processedRepos = await Promise.all(
    reposData.map(async (repo) => {
      let collaborators = [];
      try {
        const contributorsRes = await axios.get(repo.contributors_url);
        const contributorsData = contributorsRes.data;
        collaborators = contributorsData.map(contributor => ({
          name: contributor.login,
          avatar_col: contributor.avatar_url
        }));
      } catch (error) {
        console.error(`Error fetching contributors for repo ${repo.name}:`, error.message);
      }

      let languages = [];
      try {
        const languagesRes = await axios.get(repo.languages_url);
        languages = Object.keys(languagesRes.data);
      } catch (error) {
        console.error(`Error fetching languages for repo ${repo.name}:`, error.message);
      }

      return {
        name: repo.name,
        description: repo.description,
        languages: languages,
        live_link: repo.homepage || "",
        git_link: repo.svn_url,
        starred: repo.stargazers_count || 0,
        commits: 0, // Placeholder for commits count
        collaborators: collaborators
      };
    })
  );


  const followersCount = (followersRes && Array.isArray(followersRes.data)) ? followersRes.data.length : 0;
  const followingCount = (followingRes && Array.isArray(followingRes.data)) ? followingRes.data.length : 0;

  // Update GitHubUser with basic data
  githubUser.avatar = profileData.avatar_url;
  githubUser.url = profileData.html_url;
  githubUser.bio = profileData.bio;
  githubUser.repos = processedRepos;
  githubUser.followers = followersCount;
  githubUser.following = followingCount;

  // If authorized (PAT available), fetch advanced data
  if (githubUser.auth && githubUser.pat) {
    await fetchAuthData(githubUser);
  }

  await githubUser.save();
  return githubUser;
};
