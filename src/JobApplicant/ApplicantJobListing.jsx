import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './ApplicantJobListing.css';

function ApplicantJobListing() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]); // State for filtered jobs
  const [searchCriteria, setSearchCriteria] = useState({
    title: "",
    salary: "",
    location: "",
  });
  const [selectedJob, setSelectedJob] = useState(null); // State for the selected job
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const navigate = useNavigate(); // React Router's navigate function

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/applicant/jobs");
        setJobs(response.data);
        setFilteredJobs(response.data); // Initialize filtered jobs
      } catch (error) {
        console.error("Error fetching applicant jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({
      ...searchCriteria,
      [name]: value,
    });
  };

  const handleSearch = () => {
    const filtered = jobs.filter((job) => {
      const matchesTitle = job.designation.toLowerCase().includes(searchCriteria.title.toLowerCase());
      const matchesSalary = searchCriteria.salary
        ? parseInt(job.salary) >= parseInt(searchCriteria.salary)
        : true;
      const matchesLocation = job.location.toLowerCase().includes(searchCriteria.location.toLowerCase());
      return matchesTitle && matchesSalary && matchesLocation;
    });
    setFilteredJobs(filtered);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job); // Set the selected job
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedJob(null); // Clear the selected job
  };

  const handleApplyJob = () => {
    // Redirect to the application form page with the selected job details
    navigate("/application-form", { state: { job: selectedJob } });
  };

  return (
    <div>
      <div className="job-listing-container">
        <h3>Available Jobs</h3>

        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            name="title"
            placeholder="Search by Job Title"
            value={searchCriteria.title}
            onChange={handleSearchChange}
            className="search-bar"
          />
          <input
            type="number"
            name="salary"
            placeholder="Minimum Salary"
            value={searchCriteria.salary}
            onChange={handleSearchChange}
            className="search-bar"
          />
          <input
            type="text"
            name="location"
            placeholder="Search by Location"
            value={searchCriteria.location}
            onChange={handleSearchChange}
            className="search-bar"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>

        {filteredJobs.length === 0 ? (
          <p>No jobs available.</p>
        ) : (
          <ul>
            {filteredJobs.map((job) => (
              <li key={job._id} className="job-item">
                {job.logo && (
                  <img
                    src={`http://localhost:3001${job.logo}`}
                    alt="Company Logo"
                    className="job-logo"
                  />
                )}
                <h4>{job.designation}</h4>
                <p><strong>Company:</strong> {job.companyName}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> {job.salary}</p>
                <p><strong>Employment Type:</strong> {job.employmentType}</p>
                <button onClick={() => handleViewJob(job)}>View</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for Viewing Job Details */}
      {showModal && selectedJob && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
        >
          <h4>{selectedJob.designation}</h4>
          <p><strong>Company:</strong> {selectedJob.companyName}</p>
          <p><strong>Description:</strong> {selectedJob.jobDescription}</p>
          <p><strong>Salary:</strong> {selectedJob.salary}</p>
          <p><strong>Experience:</strong> {selectedJob.experience} years</p>
          <p><strong>Location:</strong> {selectedJob.location}</p>
          <p><strong>Employment Type:</strong> {selectedJob.employmentType}</p>
          {selectedJob.logo && <img src={`http://localhost:3001${selectedJob.logo}`} alt="Logo" style={{ width: "150px", height: "150px", objectFit: "cover" }} />}
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              onClick={handleApplyJob}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Apply
            </button>
            <button
              onClick={handleCloseModal}
              style={{
                padding: "10px 20px",
                backgroundColor: "#FF0000",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && (
        <div
          onClick={handleCloseModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        ></div>
      )}
    </div>
  );
}

export default ApplicantJobListing;