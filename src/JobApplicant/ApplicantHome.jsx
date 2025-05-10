import React, { useEffect } from "react";
import "./ApplicantDashboard.css"; // Add styles for the applicant dashboard

function ApplicantHome({ applicantName, applicationStats }) {
  useEffect(() => {
    console.log("ApplicantHome component mounted");
    // Fetch or reset data if needed
  }, []);

  return (
    <div className="dashboard-content">
      <div className="welcome-message">
        <h1>Welcome to your Applicant Dashboard</h1>
        <p>
          Welcome, <span>{applicantName}</span>!
        </p>
        <p>Your personalized space for exploring job opportunities and managing your applications.</p>
        <p>
          Our Job Search Portal is designed to help you find the perfect job and track your application progress with ease.
        </p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Jobs Applied</h3>
          <p>{applicationStats.totalJobsApplied}</p>
        </div>
        <div className="stat-card">
          <h3>Applications Under Review</h3>
          <p>{applicationStats.underReview}</p>
        </div>
        <div className="stat-card">
          <h3>Applications Accepted</h3>
          <p>{applicationStats.accepted}</p>
        </div>
        <div className="stat-card">
          <h3>Applications Rejected</h3>
          <p>{applicationStats.rejected}</p>
        </div>
      </div>
    </div>
  );
}

export default ApplicantHome;