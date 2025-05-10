import React from "react";
import { Navigate } from "react-router-dom";
import RecruiterDashboard from "./Recruiter/RecruiterDashboard";
import ApplicantDashboard from "./JobApplicant/ApplicantDashboard";

function Home() {
  const userType = localStorage.getItem("userType"); // Retrieve the role from local storage

  if (!userType) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {userType === "Recruiter" ? (
        <RecruiterDashboard />
      ) : userType === "Job Applicant" ? (
        <ApplicantDashboard />
      ) : (
        <h2>Unauthorized Access</h2>
      )}
    </div>
  );
}

export default Home;