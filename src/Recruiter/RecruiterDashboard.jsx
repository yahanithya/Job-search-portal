import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import AddJobs from "./AddJobs";
import RecruiterJobListing from "./RecruiterJobListing";
import MyEmployees from "./MyEmployees";
import Profile from "./Profile";
import Applications from "./Applications";
import RecruiterHome from "./RecruiterHome"; // Import the RecruiterHome component
import axios from "axios";
import "./RecruiterDashboard.css";

function RecruiterDashboard() {
  const [recruiterName, setRecruiterName] = useState("");
  const [jobStats, setJobStats] = useState({ totalJobs: 0, totalApplications: 0 });

  useEffect(() => {
    // Fetch the recruiter name from sessionStorage
    const name = sessionStorage.getItem("recruiterName") || "Recruiter";
    setRecruiterName(name);

    // Fetch job and application stats
    const fetchStats = async () => {
      try {
        const recruiterId = sessionStorage.getItem("recruiterId");
        if (!recruiterId) {
          console.error("Recruiter ID is missing.");
          return;
        }

        const response = await axios.get(`http://localhost:3001/api/recruiter/stats`, {
          params: { recruiterId },
        });

        setJobStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
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
            element={<RecruiterHome recruiterName={recruiterName} jobStats={jobStats} />}
          />
          <Route
            path="/recruiter-dashboard"
            element={<Navigate to="/recruiter-dashboard/home" />}
          />
          
          <Route path="addjobs" element={<AddJobs />} />
          <Route path="joblisting" element={<RecruiterJobListing />} />
          <Route path="myemployees" element={<MyEmployees />} />
          <Route path="applications" element={<Applications />} />
        </Routes>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
