import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Add Navigate here
import Navbar from "./Navbar";
import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
import RecruiterDashboard from "./Recruiter/RecruiterDashboard";
import ApplicantDashboard from "./JobApplicant/ApplicantDashboard";
import ApplicantJobListing from "./JobApplicant/ApplicantJobListing";
import RecruiterJobListing from "./Recruiter/RecruiterJobListing";
import RecruiterHome from "./Recruiter/RecruiterHome"; // Import the RecruiterHome component
import AddJobs from "./Recruiter/AddJobs";
import MyEmployees from "./Recruiter/MyEmployees";
import MyApplications from "./JobApplicant/MyApplications";
import Profile from "./JobApplicant/Profile";
import Notifications from "./JobApplicant/Notifications";
import ApplicationForm from "./JobApplicant/ApplicationForm";
import Applications from "./Recruiter/Applications";
import EditJob from "./Recruiter/EditJob"; // Import the EditJob component

function App() {
  const userRole = sessionStorage.getItem("role"); // Get the user role from sessionStorage

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Redirect to the appropriate dashboard based on user role */}
        <Route
          path="/"
          element={
            userRole === "recruiter" ? (
              <Navigate to="/recruiter-dashboard" />
            ) : userRole === "applicant" ? (
              <Navigate to="/applicant-dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home/*" element={<Home />} />

        <Route path="/recruiter-dashboard/*" element={<RecruiterDashboard />} >
          <Route path="addjobs" element={<AddJobs />} />
          <Route path="joblisting" element={<RecruiterJobListing />} />
          <Route path="myemployees" element={<MyEmployees />} />
          <Route path="profile" element={<Profile />} />
          <Route path="applications" element={<Applications />} />
        </Route>

        <Route path="/applicant-dashboard/*" element={<ApplicantDashboard />} >
          <Route path="job-listing" element={<ApplicantJobListing />} />
          <Route path="my-applications" element={<MyApplications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route path="/application-form" element={<ApplicationForm />} />
        <Route path="/recruiter/edit-job/:jobId" element={<EditJob />} />
      </Routes>
    </Router>
  );
}

export default App;
