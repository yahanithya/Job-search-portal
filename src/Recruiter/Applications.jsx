import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Applications.css";

function Applications() {
  const [applications, setApplications] = useState([]); // State for all applications
  const [filteredApplications, setFilteredApplications] = useState([]); // State for filtered applications
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [filters, setFilters] = useState({
    designation: "",
    skills: "",
    experience: "",
    location: "",
  }); // Filters state
  const [resumeUrl, setResumeUrl] = useState(null); // Resume popup state
  const [profileData, setProfileData] = useState(null); // Profile popup state
  const recruiterId = sessionStorage.getItem("recruiterId");
  const navigate = useNavigate();

  if (!recruiterId) {
    console.error("Recruiter ID is missing.");
    alert("Recruiter ID is missing. Please log in again.");
    navigate("/login");
  }

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log("Filters being sent:", {
          recruiterId,
          jobId: filters.jobId,
          applicantId: filters.applicantId,
        }); // Debugging log

        const response = await axios.get("http://localhost:3001/api/recruiter/applications", {
          params: {
            recruiterId,
            jobId: filters.jobId || undefined,
            applicantId: filters.applicantId || undefined,
          },
        });

        console.log("Applications fetched from API:", response.data); // Debugging log
        setApplications(response.data);
        setFilteredApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        alert("Failed to fetch applications. Please try again later.");
      }
    };

    if (recruiterId) {
      fetchApplications();
    } else {
      console.error("Recruiter ID is missing. Please log in again.");
      alert("Recruiter ID is missing. Please log in again.");
      navigate("/login");
    }
  }, [recruiterId, filters.jobId, filters.applicantId, navigate]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters({ ...filters, searchTerm: term });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const applyFilters = (updatedFilters) => {
    const { designation, skills, experience, location, searchTerm } = updatedFilters;

    const filtered = applications.filter((application) => {
      const matchesSearchTerm =
        !searchTerm ||
        application.jobId?.designation.toLowerCase().includes(searchTerm) ||
        application.applicantId?.name.toLowerCase().includes(searchTerm) ||
        application.applicantId?.email.toLowerCase().includes(searchTerm);

      const matchesDesignation =
        !designation || application.jobId?.designation.toLowerCase().includes(designation.toLowerCase());

      const matchesSkills =
        !skills || (application.skills && application.skills.toLowerCase().includes(skills.toLowerCase()));

      const matchesExperience =
        !experience || application.experience?.toString() === experience;

      const matchesLocation =
        !location || application.jobId?.location.toLowerCase().includes(location.toLowerCase());

      return (
        matchesSearchTerm &&
        matchesDesignation &&
        matchesSkills &&
        matchesExperience &&
        matchesLocation
      );
    });

    setFilteredApplications(filtered);
  };

  const handleStatusChange = async (applicationId, status) => {
    try {
      await axios.put(`http://localhost:3001/api/applications/${applicationId}/status`, {
        status,
      });
      alert(`Application ${status} successfully!`);
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === applicationId ? { ...application, status } : application
        )
      );
    } catch (error) {
      console.error(`Error updating application status to ${status}:`, error);
      alert(`Failed to ${status} the application. Please try again.`);
    }
  };

  const handleViewProfile = async (applicantId) => {
    if (!applicantId) {
      console.error("Applicant ID is undefined. Cannot fetch applicant data.");
      alert("Applicant ID is missing. Cannot fetch applicant data.");
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:3001/api/applicants/${applicantId}`);
      setProfileData(response.data); // Set the profile data to display in the popup
    } catch (error) {
      console.error("Error fetching applicant profile:", error);
      alert("Failed to fetch applicant profile. Please try again.");
    }
  };

  const handleViewResume = (resume) => {
    setResumeUrl(`http://localhost:3001/${resume}`);
  };

  const closeResumePopup = () => {
    setResumeUrl(null);
  };

  const closeProfilePopup = () => {
    setProfileData(null); // Close the profile popup
  };

  console.log("All applications:", applications);
  console.log("Filtered applications:", filteredApplications);
  console.log("Filtered applications to render:", filteredApplications);

  return (
    <div>
      <h3>Applications Received</h3>

      {/* Search Bar and Filters */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by name, email, or designation"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <div className="filters">
          <input
            type="text"
            name="jobId"
            placeholder="Filter by Job ID"
            value={filters.jobId}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="applicantId"
            placeholder="Filter by Applicant ID"
            value={filters.applicantId}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="designation"
            placeholder="Filter by Designation"
            value={filters.designation}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="skills"
            placeholder="Filter by Skills"
            value={filters.skills}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="experience"
            placeholder="Filter by Experience (years)"
            value={filters.experience}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Filter by Location"
            value={filters.location}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul className="applications-list">
          {filteredApplications.map((application, index) => {
            console.log("Application object:", application); // Debugging log
            return (
              <li key={index} className="application-item">
                <h4>{application.jobId?.designation || "N/A"}</h4>
                <p><strong>Applicant Name:</strong> {application.applicantId?.name || "N/A"}</p>
                <p><strong>Email:</strong> {application.applicantId?.email || "N/A"}</p>
                <p><strong>Skills:</strong> {application.applicantId?.skills || "N/A"}</p>
                <p><strong>Status:</strong> {application.status || "Pending"}</p>
                <p><strong>Applied On:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                <button onClick={() => handleViewProfile(application.applicantId?._id)}>View Profile</button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Resume Popup */}
      {resumeUrl && (
        <div className="resume-popup">
          <div className="resume-popup-content">
            <span className="close-button" onClick={closeResumePopup}>
              &times;
            </span>
            <iframe
              src={resumeUrl}
              title="Applicant Resume"
              style={{ width: "100%", height: "500px", border: "none" }}
            ></iframe>
          </div>
        </div>
      )}

      {/* Profile Popup */}
      {profileData && (
        <div className="profile-popup">
          <div className="profile-popup-content">
            <span className="close-button" onClick={closeProfilePopup}>
              &times;
            </span>
            <h4>Applicant Profile</h4>
            <p><strong>Name:</strong> {profileData.name}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Skills:</strong> {profileData.skills}</p>
            <p><strong>Experience:</strong> {profileData.experience} years</p>
            <p><strong>Location:</strong> {profileData.location}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applications;