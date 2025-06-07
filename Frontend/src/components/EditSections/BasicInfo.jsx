import React, { useEffect, useState } from "react"
import { Pencil, Save } from "lucide-react"
import { Country, State, City } from "country-state-city"
import axios from "axios"
import { FixedSizeList as List } from "react-window"
import { useAuth } from "../../Context/AuthProvider"
import { useTheme } from "../../App"
import { ToastContainer, toast } from "react-toastify"

// AutoCompleteInput component for the college field
const AutoCompleteInput = ({
  options,
  isDarkMode,
  selected,
  onSelect,
  disabled
}) => {
  const [inputValue, setInputValue] = useState(selected || "")
  const [isOpen, setIsOpen] = useState(false)

  // Ensure options is always an array
  const optionsArray = Array.isArray(options) ? options : []

  // Sync input when parent value changes
  useEffect(() => {
    setInputValue(selected)
  }, [selected])

  // Filter options based on input (case-insensitive)
  const filteredOptions = inputValue
    ? optionsArray.filter(opt =>
      opt.college.toLowerCase().includes(inputValue.toLowerCase())
    )
    : optionsArray

  const handleChange = e => {
    setInputValue(e.target.value)
    setIsOpen(true)
  }

  const handleSelect = value => {
    // console("Option selected:", value)
    setInputValue(value)
    onSelect(value)
    setIsOpen(false)
  }

  const Row = ({ index, style }) => {
    const option = filteredOptions[index]
    return (
      <div
        style={style}
        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => handleSelect(option.college)}
      >
        {option.college}
      </div>
    )
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        disabled={disabled}
        className={`px-3 py-2 border rounded-lg w-full ${isDarkMode
            ? "bg-gray-800 text-white border-gray-700 disabled:bg-gray-600"
            : "bg-white text-gray-900 border-gray-300 disabled:bg-gray-100"
          }`}
        placeholder="Search College"
      />
      {isOpen && filteredOptions.length > 0 && (
        <div
          className={`absolute z-40 mt-1 rounded-lg ${isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-300"
            }`}
          style={{ width: "100%", maxHeight: 200 }}
        >
          <List
            height={200}
            itemCount={filteredOptions.length}
            itemSize={35}
            width="100%"
          >
            {Row}
          </List>
        </div>
      )}
    </div>
  )
}

const BasicInfo = () => {
  const { isDarkMode } = useTheme()
  const { currentUser, updateProfile } = useAuth()
  // Combined state for all fields
  const [fields, setFields] = useState({
    name: currentUser?.name,
    mobileno: currentUser?.mobileno,
    city: currentUser?.location?.city,
    state: currentUser?.location?.state,
    country: currentUser?.location?.country,
    birthdate: currentUser?.birthdate?.slice(0, 10),
    bio: currentUser?.bio,
    website: currentUser?.website,
    position: currentUser?.position,
    college: currentUser?.education?.college,
    degree: currentUser?.education?.degree,
    branch: currentUser?.education?.branch,
    gryear: currentUser?.education?.gryear,
    skills: currentUser?.skills
  })

  // Local state for fetched options
  const [collegeOptions, setCollegeOptions] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [loading,setLoading]=useState(false);
  const [selectedCountry, setSelectedCountry] = useState(fields.country)
  const [selectedState, setSelectedState] = useState(fields.state)
  const [stateOptions, setStateOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])

  const countries = Country.getAllCountries()

  // Fetch college data from the backend
  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/VarthanV/Indian-Colleges-List/refs/heads/master/colleges.json"
      )
      .then(res => {
        setCollegeOptions(res.data)
      })
      .catch(err => console.error("Error fetching colleges:", err))
    // console(currentUser)
  }, [])

  // When selected country changes, update states and reset state/city fields
  useEffect(() => {
    if (selectedCountry) {
      setStateOptions(State.getStatesOfCountry(selectedCountry))
    } else {
      setStateOptions([])
    }
    setSelectedState("")
    setCityOptions([])
    setFields(prev => ({ ...prev, country: selectedCountry }))
  }, [selectedCountry])

  // When selected state changes, update cities
  useEffect(() => {
    if (selectedState && selectedCountry) {
      setCityOptions(City.getCitiesOfState(selectedCountry, selectedState))
    } else {
      setCityOptions([])
    }
    setFields(prev => ({ ...prev, state: selectedState }))
  }, [selectedState, selectedCountry])

  // Handler to update fields
  const handleChange = (field, value) => {
    setFields(prev => ({ ...prev, [field]: value }))
  }

  const fetchUpdatedUser = async () => {
    try {
      if (!currentUser?._id) {
        // console("No valid user ID found")
        return
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/server/user/get-user/${currentUser._id}`
      )
      if (response.status === 200 && response.data?.data) {
        await updateProfile(response.data.data)
      } else {
        // console("Invalid response received")
      }
    } catch (error) {
      console.error("Unable to fetch user", error)
    }
  }

  // Dummy save handler
  const handleSave = async () => {
    setLoading(true)
    // console("Saved fields:", fields)
    const id = currentUser._id
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/server/user/edituser/${id}`,
      fields
    )
    if (response.data.success) {
      await fetchUpdatedUser()
      toast.success("Profile updated successfully ..!")
      setEditMode(false)
      // console("User updated successfully")
    } else {
      toast.success("Failed to update Profile ..!")
    }
    setLoading(false);
  }
  return (
    <>
      <div
        className={`rounded-xl shadow-sm p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        <h3
          className={`text-lg font-semibold mb-6 ${isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
        >
          Basic Information
        </h3>
        {/* <button
          onClick={() => (editMode ? setEditMode(false) : setEditMode(true))}
          className={`p-2 ${isDarkMode
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-400 hover:text-gray-600"
            }`}
        >
          <Pencil size={18} />
        </button> */}
        <div className="space-y-6">
          {/* Name */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Name
            </label>
            <div className="w-full sm:w-2/3">
              <input
                // disabled={!editMode}
                type="text"
                value={fields.name}
                onChange={e => handleChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                  }`}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Mobile No.
            </label>
            <div className="w-full sm:w-2/3 flex items-center">
              <div className="flex items-center">
                <span
                  className={`px-3 py-2 border border-r-0 rounded-l-lg ${isDarkMode
                      ? "bg-gray-600 text-gray-200"
                      : "bg-gray-100 text-gray-700"
                    }`}
                >
                  +91
                </span>
                <input
                  // disabled={!editMode}
                  type="text"
                  value={fields.mobileno}
                  onChange={e => handleChange("mobileno", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-r-lg ${isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                    }`}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Location
            </label>
            <div className="w-full sm:w-2/3 flex items-center">
              <div className="grid grid-cols-3 gap-2 flex-1">
                <select
                  // disabled={!editMode}
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  className={`px-3 py-2 border rounded-lg ${isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                    }`}
                >
                  <option value="">Select Country</option>
                  {countries.map(ct => (
                    <option key={ct.isoCode} value={ct.isoCode}>
                      {ct.name}
                    </option>
                  ))}
                </select>
                <select
                  // disabled={!editMode}
                  value={selectedState}
                  onChange={e => setSelectedState(e.target.value)}
                  className={`px-3 py-2 border rounded-lg ${isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                    }`}
                >
                  <option value="">Select State</option>
                  {stateOptions.map(st => (
                    <option key={st.isoCode} value={st.isoCode}>
                      {st.name}
                    </option>
                  ))}
                </select>
                <select
                  // disabled={!editMode}
                  value={fields.city}
                  onChange={e => handleChange("city", e.target.value)}
                  className={`px-3 py-2 border rounded-lg ${isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                    }`}
                >
                  <option value="">Select City</option>
                  {cityOptions.map(ct => (
                    <option key={ct.id} value={ct.name}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Birthday */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Birthday
            </label>
            <div className="w-full sm:w-2/3">
              <input
                // disabled={!editMode}
                type="date"
                value={fields.birthdate}
                onChange={e => handleChange("birthdate", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                  }`}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Bio
            </label>
            <div className="w-full sm:w-2/3">
              <textarea
                // disabled={!editMode}
                value={fields.bio}
                onChange={e => handleChange("bio", e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg resize-none ${isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                  }`}
              ></textarea>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Skills
            </label>
            <div className="w-full sm:w-2/3">
              <textarea
                // disabled={!editMode}
                value={fields.skills}
                onChange={e => handleChange("skills", e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg resize-none ${isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                  }`}
              ></textarea>
            </div>
          </div>

          {/* Website */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Website
            </label>
            <div className="w-full sm:w-2/3">
              <input
                // disabled={!editMode}
                type="url"
                value={fields.website}
                onChange={e => handleChange("website", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                  }`}
              />
            </div>
          </div>

          {/* Position */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Position
            </label>
            <div className="w-full sm:w-2/3">
              <input
                // disabled={!editMode}
                type="text"
                value={fields.position}
                onChange={e => handleChange("position", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                  }`}
              />
            </div>
          </div>

          {/* Education */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <label
              className={`w-full sm:w-1/3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Education
            </label>
            <div className="w-full sm:w-2/3">
              <div className="grid grid-cols-2 gap-4">
                <AutoCompleteInput
                  isDarkMode={isDarkMode}
                  // disabled={!editMode}
                  options={collegeOptions}
                  selected={fields.college}
                  onSelect={value => handleChange("college", value)}
                />
                <input
                  // disabled={!editMode}
                  type="text"
                  value={fields.degree}
                  onChange={e => handleChange("degree", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                    }`}
                  placeholder="Degree"
                />
                <input
                  // disabled={!editMode}
                  type="text"
                  value={fields.branch}
                  onChange={e => handleChange("branch", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                    }`}
                  placeholder="Field of Study"
                />
                <input
                  // disabled={!editMode}
                  type="text"
                  value={fields.gryear}
                  onChange={e => handleChange("gryear", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                    }`}
                  placeholder="Graduation Year"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
        disabled={loading}
          onClick={handleSave}
          className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 flex items-center space-x-2"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>
    </>
  )
}

export default BasicInfo
