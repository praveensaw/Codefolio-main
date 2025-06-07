import React, { useEffect, useState } from 'react';
import {
  Github,
  MapPin,
  Briefcase,
  LinkedinIcon,
  ChevronRight,
  Trophy,
  Calendar,
  Code,
  GitFork,
  Code2,
  Twitter,
  Earth,
  ListChecks,
  RefreshCwIcon,
  RefreshCcwDot
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../App';
import { useAuth } from '../Context/AuthProvider';
import Loader from '../components/Loader';
import leetcode from '../../public//images/leetcode.png'
import geekforgeeks from '../../public/images/geekforgeeks.png'
import codechef from '../../public/images/codechef.png';
import codeforces from '../../public/images/codeforces.png';
import github from '../../public/images/github.png';
import ActivityCalendar from '../components/ActivityCalender';
import CombinedActivityCalender from '../components/CombinedActivityCalender';
import RatingGraph2 from '../components/RatingGraph2';
import RatingGraph from '../components/RatingGraph';
import CodeForcesGaph from '../components/codeforcesgraph'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const parseSubmissions2 = (submissions) => {
  return (submissions || []).map((datao) => {
    const parsedDate = new Date(datao.end_date.includes(' ') ? datao.end_date.replace(' ', 'T') : datao.end_date);
    return {
      date: parsedDate.toISOString().split('T')[0],
      rating: datao.rating,
      rank: datao.rank,
      name: datao.name,
    };
  });
};

const parseSubmissions3 = (contests) => {
  return (contests || []).map((contest) => ({
    date: new Date(contest.contest.startTime * 1000).toISOString().split("T")[0],
    ...contest
  }));
};

function Profile() {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [loading, setloading] = useState(true);
  const [displayScore, setDisplayScore] = useState(0);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [CodeForcesContest, setCodeForcesContest] = useState([]);
  const [CodeChefContest, setCodeChefContest] = useState([]);
  const [LeetCodeContest, setLeetCodeContest] = useState([]);

  const [platforms, setPlatforms] = useState([
    {
      show: false,
      name: 'LeetCode',
      solved: 0,
      rank: 0,
      rating: 0,
      logo: leetcode,
    },
    {
      show: false,
      name: 'GeeksForGeeks',
      solved: 0,
      totalSubmissions: 0,
      rating: 0,
      logo: geekforgeeks,
    },
    {
      show: false,
      name: 'CodeForces',
      solved: 0,
      pos: "",
      rating: 0,
      logo: codeforces,
    },
    {
      show: false,
      name: 'CodeChef',
      // solved: 0,
      rating: 0,
      stars: "",
      logo: codechef,
    }, {
      show: false,
      name: 'GitHub',
      repo: 0,
      contributions: 0,
      logo: github,
    }
  ]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // console("Fetching user data...");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/server/user/check-user-profile/${username}`
        );
        // console(response.data);

        if (response.data.exists) {
          const userData = response.data;
          setCodeChefContest(parseSubmissions2(userData?.codechefProfile?.contests) || []);
          setLeetCodeContest(parseSubmissions3(userData?.leetCodeProfile?.contests?.contestParticipation) || []);
          setCodeForcesContest(userData?.codeforcesProfile?.contests || []);
          setUser(userData.data);

          setPlatforms((prevPlatforms) =>
            prevPlatforms.map((platform) => {
              switch (platform.name) {
                case "LeetCode":
                  return {
                    ...platform,
                    show: !!userData.leetCodeProfile?.profile, // Check if profile exists
                    solved: userData.leetCodeProfile?.profile?.totalSolved || 0,
                    rank: userData.leetCodeProfile?.profile?.ranking || 0,
                    rating: userData.leetCodeProfile?.contests?.contestRating || 0,
                  };

                case "GeeksForGeeks":
                  return {
                    ...platform,
                    show: !!userData.geeksforgeeksProfile?.contestRating, // Check if profile exists
                    solved: parseInt(userData.geeksforgeeksProfile?.contestRating[1]) || 0,
                    rating: parseInt(userData.geeksforgeeksProfile?.contestRating[2]) || 0,
                  };

                case "CodeForces":
                  return {
                    ...platform,
                    show: !!userData.codeforcesProfile, // Check if profile exists
                    solved: userData.codeforcesProfile?.problemSolved || 0,
                    pos: userData.codeforcesProfile?.rank || "",
                    rating: userData.codeforcesProfile?.currentRating || 0,
                  };

                case "CodeChef":
                  return {
                    ...platform,
                    show: !!userData.codechefProfile, // Check if profile exists
                    // solved: userData.codechefProfile?.problemSolved || 0,
                    rating: userData.codechefProfile?.currentRating || 0,
                    stars: userData.codechefProfile?.stars || "",
                  };

                case "GitHub":
                  return {
                    ...platform,
                    show: !!userData.githubProfile, // Check if profile exists
                    repo: userData.githubProfile?.repos?.length || 0,
                    contributions: userData.githubProfile?.totalContributions || 0,
                  };

                default:
                  return platform;
              }
            })
          );

        } else {
          alert("Username not found");
        }

      } catch (error) {
        // console(error);
      } finally {
        // console.log(platforms)
        setloading(false); // Stop loading once data is fetched
      }
    };

    fetchUser();
    // console.log(platforms)
  }, [username]);


  useEffect(() => {
    if (!user?.overallScore) return;

    let start = 0;
    const end = parseFloat(user.overallScore.toFixed(2));
    const duration = 1500; // Slower animation (1.5s)
    const frameRate = 16; // Approximate frame duration (ms)
    const step = (end - start) / (duration / frameRate);

    const interval = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(interval);
        setDisplayScore(end);
      } else {
        setDisplayScore(start);
      }
    }, frameRate); // Consistent frame updates

    return () => clearInterval(interval); // Cleanup interval on re-render
  }, [user?.overallScore]);

  const fetchAllData = async () => {
    const toastId = toast(
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <RefreshCcwDot style={{ marginRight: '0.5rem' }} className="animate-spin" />
        Refreshing user profile...
      </div>,
      { autoClose: false }
    );

    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/server/user/refresh-user-profile/${username}`);

      if (response.data.success) {
        toast.update(toastId, {
          render: "Profile updated successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000
        });

        // Reload the page after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      // console(error);
      toast.update(toastId, {
        render: "Error updating profile",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };



  if (loading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1 -translate-y-1/2">
        <Loader />
        <p className='relative right-1/2'>Wait upto minute, it needs some time...!</p>
      </div>
    );
  }


  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen mt-20 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div
            className={`absolute -inset-[100%] opacity-50 ${isDarkMode
              ? 'bg-gradient-to-r from-blue-500/20 via-blue-500/20 to-pink-500/20'
              : 'bg-gradient-to-r from-sky-100 via-blue-100 to-indigo-100'
              } blur-3xl animate-[move_20s_linear_infinite] transform -translate-x-full`}
          ></div>
          <div
            className={`absolute -inset-[100%] opacity-50 ${isDarkMode
              ? 'bg-gradient-to-r from-pink-500/20 via-blue-500/20 to-blue-500/20'
              : 'bg-gradient-to-r from-indigo-100 via-blue-100 to-sky-100'
              } blur-3xl animate-[move_20s_linear_infinite_reverse] transform translate-x-full`}
          ></div>
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="w-full lg:w-64 mb-8 lg:mb-0">
              <div
                className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
              >
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="rounded-full w-full h-full object-cover border-4 border-sky-500 transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                  <h2
                    className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}
                  >
                    {user.name}
                  </h2>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    @{user.username}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {user?.location?.city && user?.location?.country && (
                    <div className="flex items-center space-x-3">
                      <MapPin
                        className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                        size={18}
                      />
                      <span className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                        {user.location.city}, {user.location.country}
                      </span>
                    </div>
                  )}
                  {user.position && (
                    <div className="flex items-center space-x-3">
                      <Briefcase
                        className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                        size={18}
                      />
                      <span className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                        {user.position}
                      </span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center space-x-3">
                      <Earth
                        className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                        size={18}
                      />
                      <FooterLink text="Website" href={user.website} />
                    </div>
                  )}
                  {user?.userProfile?.linkedin && (
                    <div className="flex items-center space-x-3">
                      <LinkedinIcon
                        className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                        size={18}
                      />
                      <FooterLink text="Linkedin Profile" href={user.userProfile.linkedin} />
                    </div>
                  )}
                  {user?.userProfile?.twitter && (
                    <div className="flex items-center space-x-3">
                      <Twitter
                        className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                        size={18}
                      />
                      <FooterLink text="X (Formerly Twitter) Profile" href={user.userProfile.twitter} />
                    </div>
                  )}
                  {user?.userProfile?.github && (
                    <div className="flex items-center space-x-3">
                      <Github
                        className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                        size={18}
                      />
                      <FooterLink text="GitHub Profile" href={user.userProfile.github} />
                    </div>
                  )}
                  {user?.userProfile?.leetcode && (
                    <div className="flex items-center space-x-3">
                      <Code2
                        className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                        size={18}
                      />
                      <FooterLink text="LeetCode Profile" href={user.userProfile.leetcode} />
                    </div>
                  )}
                  {user?.userProfile?.codeforces && (
                    <div className="flex items-center space-x-3">
                      <Code2
                        className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                        size={18}
                      />
                      <FooterLink text="CodeForces Profile" href={user.userProfile.codeforces} />
                    </div>
                  )}
                  {user?.userProfile?.codechef && (
                    <div className="flex items-center space-x-3">
                      <Code2
                        className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                        size={18}
                      />
                      <FooterLink text="CodeChef Profile" href={user.userProfile.codechef} />
                    </div>
                  )}
                  {user?.userProfile?.geeksforgeeks && (
                    <div className="flex items-center space-x-3">
                      <Code2
                        className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                        size={18}
                      />
                      <FooterLink text="GeeksforGeeks Profile" href={user.userProfile.geeksforgeeks} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 lg:ml-8">
              {
                user && user.bio && (
                  <div
                    className={`p-6 rounded-xl mt-2 mb-2 transition-transform duration-300 hover:scale-100 ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'
                      }`}
                  >
                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Bio
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                      {user.bio || 'This user has not added a bio yet.'}
                    </p>
                  </div>
                )
              }
              {
                user && user.skills && (
                  <div
                    className={`p-6 rounded-xl mt-2 mb-5 transition-transform duration-300 hover:scale-100 ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'
                      }`}
                  >
                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Skills
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                      {user.skills || 'This user has not added a bio yet.'}
                    </p>
                  </div>
                )
              }

              {
                (!platforms[0].show && !platforms[1].show &&
                  !platforms[2].show && !platforms[3].show
                ) && (
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    No Accounts Found !
                  </h3>
                )
              }

              {
                user && currentUser && user.username === currentUser.username &&
                (platforms[0].show || platforms[1].show ||
                  platforms[2].show || platforms[3].show
                ) && (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={fetchAllData}
                    className="flex justify-center items-center space-x-2 px-6 py-3 bg-white text-blue-600 border border-black rounded-full font-semibold hover:bg-blue-50 transition-colors mx-auto mb-5 w-fit"
                  >
                    <RefreshCwIcon className="h-5 w-5" />
                    <span>Refresh</span>
                  </motion.button>
                )
              }


              {
                user?.overallScore !== 0 && (
                  <motion.div
                    className={`p-6 rounded-2xl mb-5 transition-transform duration-300 hover:scale-95 ${isDarkMode
                      ? "bg-gray-900/80 backdrop-blur-xl shadow-xl border border-gray-700"
                      : "bg-white shadow-xl"
                      }`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex flex-col items-center justify-center">
                      {/* Trophy with Glow Effect */}
                      <motion.div
                        className="relative"
                        initial={{ scale: 0.5, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <Trophy
                          className="text-yellow-400 text-5xl drop-shadow-md"
                          style={{
                            filter: "drop-shadow(0px 0px 10px rgba(255, 215, 0, 0.7))",
                          }}
                        />
                      </motion.div>

                      {/* Score Animation */}
                      <motion.p
                        className={`text-4xl font-extrabold mt-3 ${isDarkMode ? "text-yellow-300" : "text-gray-800"
                          }`}
                        key={displayScore}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {displayScore.toFixed(2)}
                      </motion.p>

                      {/* Label */}
                      <p className={isDarkMode ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
                        Overall Score
                      </p>
                    </div>
                  </motion.div>
                )
              }
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {
                  user?.avgContestRating !== 0 && (
                    <div
                      className={`p-6 rounded-xl transition-transform duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Average Rating
                        </h3>
                        <Trophy className="text-yellow-500" />
                      </div>
                      <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {user?.avgContestRating?.toFixed(2)}
                      </p>
                    </div>
                  )
                }
                {
                  user && user?.totalActiveDays !== 0 && (
                    <div
                      className={`p-6 rounded-xl transition-transform duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'
                        }`}
                    >


                      <div className="flex items-center justify-between">
                        <h3 className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Active Days
                        </h3>
                        <Calendar className="text-sky-500" />
                      </div>
                      <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {user.totalActiveDays}
                      </p>
                    </div>
                  )
                }
                {
                  user && user?.totalProblemSolved !== 0 && (
                    <div
                      className={`p-6 rounded-xl transition-transform duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Total Solved
                        </h3>
                        <Code className="text-green-500" />
                      </div>
                      <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {user.totalProblemSolved}
                      </p>
                    </div>
                  )
                }

                {
                  user && user?.totalSubmissions !== 0 && (
                    <div
                      className={`p-6 rounded-xl transition-transform duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Submissions
                        </h3>
                        <ListChecks className="text-blue-500" />
                      </div>
                      <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {user.totalSubmissions}
                      </p>
                    </div>
                  )
                }

                {
                  user && user?.totalContributions !== 0 && (
                    <div
                      className={`p-6 rounded-xl transition-transform duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Contributions
                        </h3>
                        <GitFork className="text-blue-500" />
                      </div>
                      <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {user.totalContributions}
                      </p>
                    </div>
                  )
                }
              </div>

              {
                (LeetCodeContest.length > 0 || CodeChefContest.length > 0 || CodeForcesContest.length > 0) && (
                  <div className='overflow-hidden'>
                    {
                      CodeChefContest.length > 0 && (
                        <section className={`py-8 mx-auto w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                          <h2 className={`text-3xl font-bold  text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            CodeChef Contest Graph
                          </h2>
                          <RatingGraph2 data={CodeChefContest} isDarkMode={isDarkMode} />
                        </section>
                      )
                    }

                    {
                      LeetCodeContest.length > 0 && (
                        <section className={`py-8 mx-auto w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                          <h2 className={`text-3xl font-bold  text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            LeetCode Contest Graph
                          </h2>
                          <RatingGraph data={LeetCodeContest} isDarkMode={isDarkMode} />
                        </section>
                      )
                    }

                    {
                      CodeForcesContest.length > 0 && (
                        <section className={`py-8 mx-auto w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                          <h2 className={`text-3xl font-bold  text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            CodeForces Contest Graph
                          </h2>
                          <CodeForcesGaph data={CodeForcesContest} isDarkMode={isDarkMode} />
                        </section>
                      )
                    }
                  </div>

                )
              }

              {
                user && user?.combinedSubmissions && (
                  <div className='overflow-hidden'>
                    <section
                      className={`py-8 mx-auto w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                    >

                      <h2 className={`text-3xl font-bold  text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Activity Heatmap
                      </h2>
                      <div className="flex justify-between items-center px-4">


                        <select
                          value={selectedYear}
                          onChange={(e) => {
                            const year = parseInt(e.target.value);
                            // console("Year Selected:", year);
                            setSelectedYear(year);
                          }}
                          className="px-4 py-2 border rounded-lg text-gray-700 bg-white dark:bg-gray-700 dark:text-white"
                        >
                          <option value={"2025"}>2025</option>
                          <option value={"2024"}>2024</option>
                          <option value={"2023"}>2023</option>
                          <option value={"2022"}>2022</option>
                        </select>

                      </div>
                      <CombinedActivityCalender data={user?.combinedSubmissions?.[selectedYear] || []} selectedYear={parseInt(selectedYear)} isDarkMode={isDarkMode} />
                    </section>
                  </div>

                )
              }
              {/* Platform Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {platforms.map((platform, index) => (

                  platform.show && (
                    <Link to={`/user/${username}/${platform?.name?.toLowerCase()}`} key={index}>
                      <div
                        className={`p-6 rounded-xl transition-transform duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} cursor-pointer`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex justify-center items-center">
                              <img
                                src={platform?.logo}
                                alt={`${platform?.name} Logo`}
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 object-cover rounded-lg"
                              />
                            </div>

                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              {platform.name}
                            </h3>
                          </div>
                          <ChevronRight className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {platform?.solved && platform?.solved !== 0 && (
                            <div>
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Problems Solved</p>
                              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                {platform?.solved}
                              </p>
                            </div>
                          )}

                          {platform?.rating && platform?.rating !== 0 && (
                            <div>
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Rating</p>
                              <p className="text-2xl font-bold text-sky-500">
                                {platform?.rating}
                              </p>
                            </div>
                          )}



                          {/* Conditional Rendering for Rank */}
                          {platform?.pos && platform?.pos !== "" && (
                            <div className="col-span-2">
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Rank</p>
                              <p className="text-2xl font-bold text-yellow-500">
                                {platform?.pos}
                              </p>
                            </div>
                          )}

                          {platform?.rank && parseInt(platform?.rank) !== 0 && (
                            <div className="col-span-2">
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Rank</p>
                              <p className="text-2xl font-bold text-yellow-500">
                                {platform?.rank}
                              </p>
                            </div>
                          )}

                          {/* Conditional Rendering for Stars */}
                          {platform?.stars && (
                            <div className="col-span-2">
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Stars</p>
                              <p className="text-2xl font-bold text-yellow-500">
                                {platform?.stars}
                              </p>
                            </div>
                          )}

                          {platform?.repo && platform?.repo !== 0 && (
                            <div>
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Repositories</p>
                              <p className="text-2xl font-bold text-yellow-500">
                                {platform?.repo}
                              </p>
                            </div>
                          )}

                          {platform?.contributions && platform?.contributions !== 0 && (
                            <div>
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Contributions</p>
                              <p className="text-2xl font-bold text-yellow-500">
                                {platform?.contributions}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  )

                ))}


              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;

const FooterLink = ({ href, text }) => {
  // Ensure external links have the correct prefix
  const validHref =
    href.startsWith('http://') || href.startsWith('https://') ? href : `https://${href}`;

  return (
    <motion.a
      href={validHref}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ x: 5 }}
      className="text-sky-500 hover:underline"
    >
      {text}
    </motion.a>
  );
};
