import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Award, Users, Zap, Star, Trophy, Target, GitFork } from 'lucide-react';
import { useTheme } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import about1 from '../../public/images/about1.avif'
import about2 from '../../public/images/about2.avif'
const About = () => {
  const [stat,setStat]=useState([]);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { isDarkMode } = useTheme();

  useEffect(() => {
    async function fetchStat() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/server/user/stat`)
        // console(response)
        setStat(response.data);
      } catch (error) {
        // console(error);
        
      }
    }

    fetchStat();
  },[])

  return (
    <><Navbar/>
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`relative py-20 px-4 overflow-hidden ${
          isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sky-500 to-blue-600'
        }`}
      >
        <div className="absolute inset-0">
          <img
            src={about1}
            alt="Tech Background"
            className={`w-full h-full object-cover ${isDarkMode ? 'opacity-100' : 'opacity-100'}`}
          />
        </div>
        <div className="container mx-auto mt-10 relative z-10">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white text-center mb-6"
          >
            About CodeVerse
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white text-center max-w-3xl mx-auto"
          >
            Empowering developers to showcase their competitive programming journey across multiple platforms.
          </motion.p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <section ref={ref} className={`py-20 px-4 relative overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className={`text-3xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Our Mission</h2>
              <p className={`leading-relaxed mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                We believe in creating a unified platform where programmers can showcase their skills, track their progress, and connect with like-minded individuals.
              </p>
              <ul className="space-y-4">
                {[
                  'Unified profile management across platforms',
                  'Real-time progress tracking and analytics',
                  'Community-driven learning environment',
                  'Career growth opportunities'
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={inView ? { x: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.2 * index }}
                    className={`flex items-center space-x-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <Zap className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={inView ? { x: 0, opacity: 1 } : {}}
              className="relative rounded-lg overflow-hidden shadow-xl"
            >
              <img
                src={about2}
                alt="Team"
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 opacity-50' 
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 opacity-20'
              }`} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className={`py-20 relative overflow-hidden ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Star />, title: 'Excellence', description: 'Striving for the highest quality in everything we do' },
              { icon: <Trophy />, title: 'Achievement', description: 'Celebrating and recognizing developer accomplishments' },
              { icon: <Target />, title: 'Focus', description: 'Maintaining clear goals and determined execution' },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 border border-white' 
                    : 'bg-gray-50'
                }`}
              >
                <div className="text-blue-500 mb-4">{value.icon}</div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{value.title}</h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 relative overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-sky-500 to-blue-600'
      }`}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Users />, stat: stat.active, label: 'Active Users' },
              { icon: <Code />, stat: '5', label: 'Platforms Integrated' },
              { icon: <Award />, stat: stat.totalProblemSolved, label: 'Problems Solved' },
              { icon: <GitFork />, stat: stat.totalContribution, label: 'Total Contributions' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 * index }}
                className={`text-center p-6 rounded-xl ${
                  isDarkMode 
                    ? 'bg-gray-900 bg-opacity-50 border border-white' 
                    : 'bg-white/10 backdrop-blur-sm'
                }`}
              >
                <div className="text-white mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-4xl font-bold text-white mb-2">{item.stat}</h3>
                <p className="text-blue-200">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default About;