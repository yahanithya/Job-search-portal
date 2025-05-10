import React, { useEffect, useState } from "react";
import axios from "axios";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const userId = sessionStorage.getItem("applicantId"); // Retrieve applicant ID from localStorage

  useEffect(() => {
    if (!userId) {
      alert("Applicant ID not found. Please log in again.");
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/applications/${userId}`);
        console.log("Applications fetched:", response.data); // Debugging
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        alert("Failed to fetch applications. Please try again later.");
      }
    };

    fetchApplications();
  }, [userId]);

  const handleDelete = async (applicationId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this application?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:3001/api/applications/${applicationId}`);
      if (response.status === 200) {
        alert("Application deleted successfully!");
        setApplications(applications.filter((app) => app._id !== applicationId)); // Update the state
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application. Please try again.");
    }
  };

  return (
    <div>
      <h3>My Applications</h3>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {applications.map((application, index) => (
            <li
              key={index}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h4>{application.jobId?.designation || "N/A"}</h4>
              <p><strong>Company:</strong> {application.jobId?.companyName || "N/A"}</p>
              <p><strong>Status:</strong> {application.status || "Pending"}</p>
              <p><strong>Applied On:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
              <button
                onClick={() => handleDelete(application._id)}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyApplications;