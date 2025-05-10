import React, { useEffect } from "react";
import "./RecruiterDashboard.css";

function RecruiterHome({ recruiterName, jobStats }) {
  useEffect(() => {
    console.log("RecruiterHome component mounted");
    // Reset or fetch data if needed
  }, []);

  return (
    <div className="dashboard-content">
      <div className="welcome-message">
        <h1>Welcome to your Recruiter Dashboard</h1>
        <p>
          Welcome, <span>{recruiterName}</span>!
        </p>
        <p>Your command center for discovering top talent and managing job applications with ease.</p>
        <p>
          Our Job Search Portal is designed to streamline the entire recruitment process, giving you full control and visibility from job posting to candidate selection.
        </p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Jobs Posted</h3>
          <p>{jobStats.totalJobs}</p>
        </div>
        <div className="stat-card">
          <h3>Total Applications Received</h3>
          <p>{jobStats.totalApplications}</p>
        </div>
      </div>
    </div>
  );
}

export default RecruiterHome;