import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar"; // Sidebar for navigation
import ApplicantHome from "./ApplicantHome";
import ApplicantJobListing from "./ApplicantJobListing";
import MyApplications from "./MyApplications";
import Profile from "./Profile";
import Notifications from "./Notifications";
import "./ApplicantDashboard.css"; // Import external styles

function ApplicantDashboard() {
  const [applicantName, setApplicantName] = useState("Applicant");
  const [applicationStats, setApplicationStats] = useState({
    totalJobsApplied: 0,
    underReview: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    // Fetch applicant name and stats from sessionStorage or an API
    const name = sessionStorage.getItem("applicantName") || "Applicant";
    setApplicantName(name);

    // Example stats (replace with API call if needed)
    const stats = {
      totalJobsApplied: 10,
      underReview: 0,
      accepted: 0,
      rejected: 0,
    };
    setApplicationStats(stats);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="dashboard-content">
        <Routes>
          <Route
            path="/"
            element={<ApplicantHome applicantName={applicantName} applicationStats={applicationStats} />}
          />
          <Route path="job-listing" element={<ApplicantJobListing />} />
          <Route path="my-applications" element={<MyApplications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
        </Routes>
      </div>
    </div>
  );
}

export default ApplicantDashboard;