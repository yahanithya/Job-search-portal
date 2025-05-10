import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RecruiterJobListing.css"; // Assuming you have some CSS for styling

function RecruiterJobListing() {
  const [jobs, setJobs] = useState([]); // Initialize jobs as an empty array
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const recruiterId = sessionStorage.getItem("recruiterId"); // Get recruiterId from sessionStorage
        if (!recruiterId) {
          setError("Recruiter ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3001/api/recruiter/jobs", {
          params: { recruiterId },
        });
        console.log("Jobs fetched from API:", response.data); // Debugging
        setJobs(response.data); // Assuming the API returns an array of jobs
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleEdit = (jobId) => {
    // Navigate to the edit page with the job ID
    navigate(`/recruiter/edit-job/${jobId}`);
  };

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="job-listing-container">
      <h2>Your Job Listings</h2>
      {jobs.length === 0 ? (
        <p>No jobs found. Add jobs to see them listed here.</p>
      ) : (
        <ul className="job-list">
          {jobs.map((job) => (
            <li key={job._id} className="job-item">
              {job.logo && (
                <div className="job-logo">
                  <img src={`http://localhost:3001/${job.logo}`} alt={`${job.designation} logo`} />
                </div>
              )}
              <h3>{job.designation}</h3>
              <p><strong>Company:</strong> {job.companyName}</p>
              <p><strong>Description:</strong> {job.jobDescription}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p><strong>Experience:</strong> {job.experience} years</p>
              <p><strong>Employment Type:</strong> {job.employmentType}</p>
              <button className="edit-button" onClick={() => handleEdit(job._id)}>
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecruiterJobListing;