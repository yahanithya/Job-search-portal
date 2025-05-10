import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditJob.css"; // Import your CSS file for styling 

function EditJob() {
  const { jobId } = useParams(); // Get the job ID from the route
  const [formData, setFormData] = useState({
    designation: "",
    companyName: "",
    jobDescription: "",
    salary: "",
    experience: "",
    location: "",
    employmentType: "Full-Time",
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Job ID:", jobId); // Debugging
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/jobs/${jobId}`);
        setFormData(response.data.job); // Populate the form with job details
      } catch (err) {
        console.error("Error fetching job details:", err);
        if (err.response?.status === 404) {
          alert("Job not found. Please check the job ID.");
        } else {
          alert("Failed to load job details. Please try again later.");
        }
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/jobs/${jobId}`, formData);
      alert("Job updated successfully!");
      navigate("/recruiter-dashboard/joblisting"); // Redirect to job listing page
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Failed to update job. Please try again.");
    }
  };

  return (
    <div className="edit-job-container">
      <h2>Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="designation">Designation:</label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="jobDescription">Job Description:</label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="salary">Salary:</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="experience">Experience:</label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="employmentType">Employment Type:</label>
          <select
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <button type="submit">Update Job</button>
      </form>
    </div>
  );
}

export default EditJob;