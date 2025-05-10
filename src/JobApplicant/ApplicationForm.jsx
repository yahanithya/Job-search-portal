import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ApplicationForm() {
  const location = useLocation(); // Get job details passed via state
  const navigate = useNavigate();
  const { job } = location.state || {}; // Extract the job details

  const [formData, setFormData] = useState({
    name: "",
    institute: "",
    endYear: "",
    dob: "",
    degree: "",
    cgpa: "",
    photo: null,
    resume: null,
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("institute", formData.institute);
      data.append("endYear", formData.endYear);
      data.append("dob", formData.dob);
      data.append("degree", formData.degree);
      data.append("cgpa", formData.cgpa);
      data.append("skills", formData.skills);
      data.append("photo", formData.photo);
      data.append("resume", formData.resume);
      data.append("recruiterId", sessionStorage.getItem("recruiterId")); // Include the recruiter ID
      data.append("jobId", job._id); // Include the job ID
      data.append("applicantId", sessionStorage.getItem("applicantId")); // Include the applicant ID

      console.log("FormData being sent:", Object.fromEntries(data.entries())); // Debugging

      await axios.post("http://localhost:3001/api/applications", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Application submitted successfully!");
      navigate("/applicant-dashboard/job-listing"); // Redirect back to job listing page
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h3>Apply for {job?.designation}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", padding: "8px", width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Institute:</label>
          <input
            type="text"
            name="institute"
            value={formData.institute}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", padding: "8px", width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>End Year:</label>
          <input
            type="number"
            name="endYear"
            value={formData.endYear}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", padding: "8px", width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", padding: "8px", width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Degree:</label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", padding: "8px", width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>CGPA:</label>
          <input
            type="number"
            step="0.01"
            name="cgpa"
            value={formData.cgpa}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", padding: "8px", width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Skills:</label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", padding: "8px", width: "100%" }}
          ></textarea>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Photo:</label>
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            required
            style={{ display: "block", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Resume:</label>
          <input
            type="file"
            name="resume"
            onChange={handleFileChange}
            required
            style={{ display: "block", marginBottom: "10px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default ApplicationForm;