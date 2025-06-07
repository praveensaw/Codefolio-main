import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Code, Award } from 'lucide-react';
import PlatformComparisonDisplay from './PlatformComparisonDisplay';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PlatformComparisonDisplay2 from './PlatformComparisonDisplay2';
import PlatformComparisonDisplay3 from './PlatformComparisonDisplay3';
import { useTheme } from '../../App';

const ComparisonResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { candidate1, candidate2 } = location.state || {};

  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!candidate1 || !candidate2) {
      navigate('/dashboard/compare');
      return;
    }

    const compareCandidates = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/dashboard/comparecandidate/compare/two`,
          { candidate1, candidate2 }
        );
        console.log(response.data);
        setComparisonData(response.data);
      } catch (err) {
        console.error('Error during candidate comparison:', err);
        setError('An error occurred while comparing candidates. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    compareCandidates();
  }, [candidate1, candidate2, navigate]);

  const generatePDF = () => {
    const buttonsContainer = document.getElementById('pdf-exclude');
    if (buttonsContainer) {
      buttonsContainer.style.display = 'none';
    }

    const input = document.getElementById('report-content');
    html2canvas(input, {
      useCORS: true,
      allowTaint: false,
      scale: 2,
    }).then((canvas) => {
      if (buttonsContainer) {
        buttonsContainer.style.display = 'flex';
      }
      const imgData = canvas.toDataURL('image/jpeg', 0.5);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const marginTop = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight() - marginTop;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`comparison-report-${candidate1.username}-${candidate2.username}.pdf`);
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Code className="h-12 w-12 text-indigo-600 animate-spin" />
        <p className={`mt-4 text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Comparing candidates, please wait...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-xl text-red-600 mb-4">{error}</p>
        <Link to="/dashboard/compare">
          <button
            className={`px-6 py-3 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            Start New Comparison
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div
      id="report-content"
      className={`max-w-6xl mx-auto p-4 space-y-10 ${
        isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'
      }`}
    >
      <h1 className={`text-3xl font-extrabold text-center mt-10 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        Coder's Comparison Results
      </h1>

      {/* Overall Comparison Section */}
      <section
        className={`rounded-xl shadow-lg p-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h2 className={`text-2xl font-bold text-center mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Overall Comparison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[candidate1, candidate2].map((candidate) => (
            <div
              key={candidate.username}
              className={`flex flex-col items-center border p-6 rounded-lg transition-shadow hover:shadow-xl ${
                isDarkMode ? 'border-gray-700' : 'border-gray-300'
              }`}
            >
              <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
                <img
                  src={candidate.profilePicture || '/default-avatar.png'}
                  alt={candidate.username}
                  className="h-full w-full object-cover"
                />
              </div>
              <Link
                to={`https://codefolio-platform.vercel.app/user/${candidate.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline cursor-pointer transition-all duration-200"
              >
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {candidate.username}
                </h3>
              </Link>

              <div className="mt-4 w-full text-center py-3 rounded-lg bg-indigo-50">
                <p className="text-3xl font-bold text-indigo-600">
                  {candidate.overallScore.toFixed(2)}
                </p>
                <p className="text-gray-600">Overall Score</p>
              </div>
            </div>
          ))}
        </div>
        {comparisonData.aggregatedWins && (
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold text-green-600">
              Overall Winner:{" "}
              {comparisonData.aggregatedWins.candidate1 > comparisonData.aggregatedWins.candidate2
                ? candidate1.username
                : candidate2.username}
            </h3>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          {comparisonData.aggregatedWins.candidate1 !== comparisonData.aggregatedWins.candidate2 ? (
            <div className="flex items-center space-x-2 animate-pulse">
              <Award className="h-6 w-6 text-yellow-500" />
              <span className="text-lg font-semibold text-green-600">
                Winner:{" "}
                {comparisonData.aggregatedWins.candidate1 > comparisonData.aggregatedWins.candidate2
                  ? candidate1.username
                  : candidate2.username}
              </span>
            </div>
          ) : (
            <span className="text-lg font-semibold text-gray-500">Tie</span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xl font-bold text-indigo-600">{candidate1.username}</p>
            <p className="text-2xl font-extrabold">
              {comparisonData.aggregatedWins.candidate1}
            </p>
            <p className="text-sm text-gray-500">Score</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <p className="text-sm text-gray-500">Coding Platforms</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-indigo-600">{candidate2.username}</p>
            <p className="text-2xl font-extrabold">
              {comparisonData.aggregatedWins.candidate2}
            </p>
            <p className="text-sm text-gray-500">Score</p>
          </div>
        </div>

        <PlatformComparisonDisplay2
          platformComparisons={comparisonData.platformComparisons.leetcode}
          platform="LeetCode"
        />
        <PlatformComparisonDisplay2
          platformComparisons={comparisonData.platformComparisons.codeforces}
          platform="CodeForces"
        />
        <PlatformComparisonDisplay2
          platformComparisons={comparisonData.platformComparisons.codechef}
          platform="CodeChef"
        />
        <PlatformComparisonDisplay2
          platformComparisons={comparisonData.platformComparisons.gfg}
          platform="GeeksforGeeks"
        />
        <PlatformComparisonDisplay2
          platformComparisons={comparisonData.platformComparisons.github}
          platform="GitHub"
        />

        <div className="grid grid-cols-3 gap-4 mb-4 mt-10">
          <div className="text-center">
            <p className="text-xl font-bold text-indigo-600">{candidate1.username}</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <p className="text-lg font-medium text-gray-600">Overall metrics</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-indigo-600">{candidate2.username}</p>
          </div>
        </div>
        <PlatformComparisonDisplay3
          candidate1={candidate1.totalActiveDays}
          candidate2={candidate2.totalActiveDays}
          metric="Total Active Days"
        />
        <PlatformComparisonDisplay3
          candidate1={candidate1.totalProblemSolved}
          candidate2={candidate2.totalProblemSolved}
          metric="Total Problem Solved"
        />
        <PlatformComparisonDisplay3
          candidate1={candidate1.totalContributions}
          candidate2={candidate2.totalContributions}
          metric="Total Contributions"
        />
        <PlatformComparisonDisplay3
          candidate1={candidate1.avgContestRating.toFixed(2)}
          candidate2={candidate2.avgContestRating.toFixed(2)}
          metric="Average Contest Rating"
        />
      </section>

      {/* Platform-wise Comparison Section */}
      {comparisonData.platformComparisons.leetcode && (
        <PlatformComparisonDisplay
          platform="leetcode"
          data={comparisonData.platformComparisons.leetcode}
          candidate1={candidate1}
          candidate2={candidate2}
        />
      )}
      {comparisonData.platformComparisons.codeforces && (
        <PlatformComparisonDisplay
          platform="codeforces"
          data={comparisonData.platformComparisons.codeforces}
          candidate1={candidate1}
          candidate2={candidate2}
        />
      )}
      {comparisonData.platformComparisons.codechef && (
        <PlatformComparisonDisplay
          platform="codechef"
          data={comparisonData.platformComparisons.codechef}
          candidate1={candidate1}
          candidate2={candidate2}
        />
      )}
      {comparisonData.platformComparisons.gfg && (
        <PlatformComparisonDisplay
          platform="gfg"
          data={comparisonData.platformComparisons.gfg}
          candidate1={candidate1}
          candidate2={candidate2}
        />
      )}
      {comparisonData.platformComparisons.github && (
        <PlatformComparisonDisplay
          platform="github"
          data={comparisonData.platformComparisons.github}
          candidate1={candidate1}
          candidate2={candidate2}
        />
      )}

      <div id="pdf-exclude" className="flex justify-center mt-8 space-x-4">
        <button
          onClick={generatePDF}
          className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
        >
          Download Report as PDF
        </button>
        <Link to="/dashboard/compare">
          <button
            className={`px-8 py-4 rounded-lg transition-colors text-lg ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            Start New Comparison
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ComparisonResultPage;
