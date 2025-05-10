import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddJobs.css"; // Import your CSS file for styling

function AddJobs() {
  const [formData, setFormData] = useState({
    designation: "",
    companyName: "",
    jobDescription: "",
    salary: "",
    experience: "",
    location: "",
    employmentType: "Full-Time",
  });

  const [logo, setLogo] = useState(null); // State for the logo file
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Invalid file type. Please upload an image.");
      } else if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB. Please upload a smaller file.");
      } else {
        setLogo(file); // Set the selected file
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.designation || !formData.companyName || !formData.jobDescription) {
      alert("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const recruiterId = sessionStorage.getItem("recruiterId"); // Automatically get recruiterId from sessionStorage
      const data = new FormData();
      data.append("designation", formData.designation);
      data.append("companyName", formData.companyName);
      data.append("jobDescription", formData.jobDescription);
      data.append("salary", formData.salary);
      data.append("experience", formData.experience);
      data.append("location", formData.location);
      data.append("employmentType", formData.employmentType);
      data.append("recruiterId", recruiterId); // Add recruiterId automatically
      if (logo) {
        data.append("logo", logo); // Append the logo file
      }

      console.log("Form Data:", Object.fromEntries(data.entries())); // Debugging log

      const response = await axios.post("http://localhost:3001/api/jobs", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Job added successfully!");
      console.log("Job added:", response.data);

      // Reset the form
      setFormData({
        designation: "",
        companyName: "",
        jobDescription: "",
        salary: "",
        experience: "",
        location: "",
        employmentType: "Full-Time",
      });
      setLogo(null); // Reset the logo file
    } catch (error) {
      console.error("Error adding job:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add job. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-jobs-container">
      <h3>Add Job</h3>
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
          <label htmlFor="salary">Salary (per annum):</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="experience">Experience (in years):</label>
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
        <div>
          <label htmlFor="logo">Company Logo:</label>
          <input
            type="file"
            id="logo"
            name="logo"
            onChange={handleLogoChange}
            accept="image/*"
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding Job..." : "Add Job"}
        </button>
      </form>
    </div>
  );
}

export default AddJobs;