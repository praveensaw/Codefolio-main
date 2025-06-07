import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Download,
  School,
  ListChecks,
} from "lucide-react";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { Link } from "react-router-dom";
import { useTheme } from "../App";

const AllCoders = () => {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [platform, setPlatform] = useState("LeetCode");
  const [selectedCollege, setSelectedCollege] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("solved");
  const [sortDirection, setSortDirection] = useState("desc");
  const [userRange, setUserRange] = useState({ start: 1, end: 1 });
  const itemsPerPage = 10;
  const tableRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [platform]);

  const transformUserData = (apiUsers) => {
    return apiUsers
      .filter((user) => user.username && user.name)
      .map((user) => ({
        username: user.username,
        name: user.name,
        solved: user[platform] || 0,
        platform,
        college: user.college || "Not Provided",
        branch: user.branch || "Not Provided",
        totalActiveDays: user.totalActiveDays || 0,
      }));
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/dashboard/allcoders/get-all`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setUsers(transformUserData(result.data));
        console.log(transformUserData(result.data));

      } else {
        throw new Error("Invalid data format received from server.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setUsers(transformUserData(mockUsers));
      setError("Unable to connect to the server. Showing sample data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortedUsers = (users) => {
    return [...users].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      return sortDirection === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1;
    });
  };

  const getUniqueColleges = () => {
    const colleges = users.map((user) => user.college);
    return ["All", ...new Set(colleges)];
  };

  const getUniqueBranches = () => {
    const branches = users.map((user) => user.branch);
    return ["All", ...new Set(branches)];
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCollege =
      selectedCollege === "All" || user.college === selectedCollege;
    const matchesBranch =
      selectedBranch === "All" || user.branch === selectedBranch;
    return matchesSearch && matchesCollege && matchesBranch;
  });

  const sortedUsers = getSortedUsers(filteredUsers);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRangeChange = (e) => {
    const value = e.target.value.trim();

    if (value === "") {
      setUserRange({ start: 1, end: 1 });
      return;
    }

    const match = value.match(/^(\d+)-(\d+)$/);
    if (match) {
      const start = parseInt(match[1]);
      const end = parseInt(match[2]);

      if (start >= 1 && end >= start && end <= sortedUsers.length) {
        setUserRange({ start, end });
      }
    }
  };

  const rangeFilteredUsers = sortedUsers.slice(
    userRange.start - 1,
    userRange.end
  );

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 inline-block ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline-block ml-1" />
    );
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-700"} p-6 pt-14 flex flex-col gap-6`}
    >
      {error && (
        <div
          className={`p-4 rounded-lg mb-4 flex justify-between items-center animate-fadeIn ${isDarkMode ? "bg-yellow-700/80 text-yellow-200" : "bg-yellow-200 text-yellow-700"
            }`}
        >
          <p>{error}</p>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md flex items-center transition-transform ${isDarkMode ? "bg-yellow-600 hover:bg-yellow-500" : "bg-yellow-400 hover:bg-yellow-300"
              } ${isLoading ? "" : "hover:scale-105"}`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      <div
        className={`w-full p-4 rounded-2xl border grid grid-cols-1 md:grid-cols-3 gap-4 ${isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
      >
        <div className="relative">
          <ListChecks className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            className={`w-full h-12 rounded-lg pl-10 pr-10 border focus:border-blue-500 appearance-none ${isDarkMode ? "bg-gray-800 text-gray-300 border-gray-600" : "bg-white text-gray-700 border-gray-300"
              }`}
            onChange={(e) => setPlatform(e.target.value)}
            value={platform}
          >
            <option value="LeetCode">LeetCode</option>
            {/* <option value="CodeChef">CodeChef</option> */}
            <option value="CodeForces">CodeForces</option>
            <option value="GeeksforGeeks">GeeksforGeeks</option>
            <option value="Github">Github</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        <div className="relative">
          <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            className={`w-full h-12 rounded-lg pl-10 pr-10 border focus:border-blue-500 appearance-none ${isDarkMode ? "bg-gray-800 text-gray-300 border-gray-600" : "bg-white text-gray-700 border-gray-300"
              }`}
            onChange={(e) => setSelectedCollege(e.target.value)}
            value={selectedCollege}
          >
            {getUniqueColleges().map((college) => (
              <option key={college} value={college}>
                {college}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        <div className="relative">
          <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            className={`w-full h-12 rounded-lg pl-10 pr-10 border focus:border-blue-500 appearance-none ${isDarkMode ? "bg-gray-800 text-gray-300 border-gray-600" : "bg-white text-gray-700 border-gray-300"
              }`}
            onChange={(e) => setSelectedBranch(e.target.value)}
            value={selectedBranch}
          >
            {getUniqueBranches().map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      <div
        className={`p-4 rounded-2xl border relative flex gap-4 ${isDarkMode ? "bg-gray-800/60 border-gray-700" : "bg-gray-100 border-gray-300"
          }`}
      >
        <div className="w-full relative">
          <Search className="absolute pr-12 left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full h-12 rounded-lg pl-10 pr-12 border focus:border-blue-500 ${isDarkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "bg-white text-gray-700 border-gray-300"
              }`}
          />
        </div>

        <input
          type="text"
          placeholder="1-5"
          onChange={handleRangeChange}
          className={`h-12 rounded-lg pl-3 pr-3 border focus:border-blue-500 w-32 ${isDarkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "bg-white text-gray-700 border-gray-300"
            }`}
        />
      </div>

      <div
        className={`overflow-x-auto p-4 rounded-2xl border ${isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
      >
        <table ref={tableRef} className="min-w-full table-auto ">
          <thead>
            <tr className="text-left">
              <th className={` border border-black p-2 ${isDarkMode ? "text-gray-300 border-white" : "text-gray-700"}`}>No.</th>
              <th onClick={() => handleSort("username")} className={` border border-black cursor-pointer p-2 ${isDarkMode ? "border-white text-gray-300" : "text-gray-700"}`}>
                Username <SortIcon field="username" />
              </th>
              <th onClick={() => handleSort("name")} className={` border border-black cursor-pointer p-2 ${isDarkMode ? "border-white text-gray-300" : "text-gray-700"}`}>
                Name <SortIcon field="name" />
              </th>
              <th onClick={() => handleSort("college")} className={` border border-black cursor-pointer p-2 ${isDarkMode ? "border-white text-gray-300" : "text-gray-700"}`}>
                College <SortIcon field="college" />
              </th>
              <th onClick={() => handleSort("branch")} className={` border border-black cursor-pointer p-2 ${isDarkMode ? "border-white text-gray-300" : "text-gray-700"}`}>
                Branch <SortIcon field="branch" />
              </th>
              <th onClick={() => handleSort("solved")} className={` border border-black cursor-pointer p-2 ${isDarkMode ? "border-white text-gray-300" : "text-gray-700"}`}>
                {platform === "Github" ? "Contributions" : "Solved"} <SortIcon field="solved" />
              </th>
              <th onClick={() => handleSort("totalActiveDays")} className={` border border-black cursor-pointer p-2 ${isDarkMode ? "border-white text-gray-300" : "text-gray-700"}`}>
                Total Active Days <SortIcon field="totalActiveDays" />
              </th>
            </tr>
          </thead>
          <tbody className="table-auto border-collapse">
            {(userRange.start !== 1 || userRange.end !== 1 ? rangeFilteredUsers : paginatedUsers).map(
              (user, index) => (
                <tr key={user.username} className={`${isDarkMode ? "hover:text-black hover:bg-gray-100" : "hover:text-white hover:bg-gray-800"}`}>
                  <td className={`p-2 border border-black ${isDarkMode && "border-white"}`}>
                    {userRange.start !== 1 || userRange.end !== 1
                      ? userRange.start + index
                      : (currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className={`p-2 border border-black ${isDarkMode && "border-white"}`}>
                    <Link
                      to={`https://codefolio-platform.vercel.app/user/${user.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline cursor-pointer transition-all duration-200"
                    >
                      {user.username}
                    </Link>
                  </td>
                  <td className={`p-2 border border-black ${isDarkMode && "border-white"}`}>{user.name}</td>
                  <td className={`p-2 border border-black ${isDarkMode && "border-white"}`}>{user.college}</td>
                  <td className={`p-2 border border-black ${isDarkMode && "border-white"}`}>{user.branch}</td>
                  <td className={`p-2 border border-black ${isDarkMode && "border-white"}`}>{user.solved}</td>
                  <td className={`p-2 border border-black ${isDarkMode && "border-white"}`}>{user.totalActiveDays}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between rounded-md items-center mt-4">
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={
            currentPage === 1 || (userRange.start !== 1 || userRange.end !== 1)
          }
          className="bg-blue-600 rounded-l-md hover:bg-blue-500 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg"
        >
          Previous
        </button>
        <span className="px-4 py-2 rounded-lg">
          {userRange.start !== 1 || userRange.end !== 1
            ? `Showing ${userRange.start}-${userRange.end} of ${sortedUsers.length}`
            : `Page ${currentPage} of ${Math.ceil(sortedUsers.length / itemsPerPage)}`}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={
            currentPage * itemsPerPage >= sortedUsers.length ||
            userRange.start !== 1 ||
            userRange.end !== 1
          }
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg"
        >
          Next
        </button>
      </div>

      <div className="flex justify-center items-center my-6">
        <DownloadTableExcel
          filename={`coding-stats-${platform.toLowerCase()}`}
          sheet={platform}
          currentTableRef={tableRef.current}
        >
          <button className="relative w-64 overflow-hidden border-2 border-black bg-black text-white font-extrabold uppercase px-8 py-4 rounded-full transition duration-200 group">
            <span className="relative z-10 flex items-center justify-center gap-2 mix-blend-difference">
              <Download className="w-5 h-5" />
              Export
            </span>
            <span className="absolute inset-0 -translate-y-full bg-[linear-gradient(90deg,white_25%,transparent_0,transparent_50%,white_0,white_75%,transparent_0)] transition-transform duration-200 group-hover:translate-y-0"></span>
            <span className="absolute inset-0 translate-y-full bg-[linear-gradient(90deg,transparent_0,transparent_25%,white_0,white_50%,transparent_0,transparent_75%,white_0)] transition-transform duration-200 group-hover:translate-y-0 z-[-1]"></span>
          </button>
        </DownloadTableExcel>
      </div>
    </div>

  );
}

export default AllCoders;
