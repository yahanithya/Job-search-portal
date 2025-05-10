import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaBriefcase, FaList, FaFileAlt, FaUsers, FaUser } from "react-icons/fa"; // Import icons
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Recruiter Dashboard</h3>
      <nav>
        <ul className="sidebar-links">
          {/* Home Link */}
          <li>
            <NavLink
              to="/recruiter-dashboard/recruiter-dashboard"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaHome className="sidebar-icon" /> Home
            </NavLink>
          </li>

          {/* Add Jobs Link */}
          <li>
            <NavLink
              to="/recruiter-dashboard/addjobs"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaBriefcase className="sidebar-icon" /> Add Jobs
            </NavLink>
          </li>

          {/* Job Listing Link */}
          <li>
            <NavLink
              to="/recruiter-dashboard/joblisting"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaList className="sidebar-icon" /> Job Listing
            </NavLink>
          </li>

          {/* Applications Link */}
          <li>
            <NavLink
              to="/recruiter-dashboard/applications"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaFileAlt className="sidebar-icon" /> Applications
            </NavLink>
          </li>

          {/* My Employees Link */}
          <li>
            <NavLink
              to="/recruiter-dashboard/myemployees"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaUsers className="sidebar-icon" /> My Employees
            </NavLink>
          </li>

          {/* Profile Link */}
          <li>
            <NavLink
              to="/recruiter-dashboard/profile"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaUser className="sidebar-icon" /> Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;