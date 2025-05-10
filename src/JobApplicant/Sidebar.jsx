import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaList, FaFileAlt, FaUser, FaBell } from "react-icons/fa"; // Import icons
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Applicant Dashboard</h3>
      <nav>
        <ul className="sidebar-links">
          {/* Home Link */}
          <li>
            <NavLink
              to="/applicant-dashboard/home"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaHome className="sidebar-icon" /> Home
            </NavLink>
          </li>

          {/* Job Listing Link */}
          <li>
            <NavLink
              to="/applicant-dashboard/job-listing"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaList className="sidebar-icon" /> Job Listing
            </NavLink>
          </li>

          {/* My Applications Link */}
          <li>
            <NavLink
              to="/applicant-dashboard/my-applications"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaFileAlt className="sidebar-icon" /> My Applications
            </NavLink>
          </li>

          {/* Profile Link */}
          <li>
            <NavLink
              to="/applicant-dashboard/profile"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaUser className="sidebar-icon" /> Profile
            </NavLink>
          </li>

          {/* Notifications Link */}
          <li>
            <NavLink
              to="/applicant-dashboard/notifications"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaBell className="sidebar-icon" /> Notifications
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;