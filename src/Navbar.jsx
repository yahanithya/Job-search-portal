import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage or any authentication tokens
    localStorage.clear();
    // Redirect to the login page
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light"
      style={{
        padding: "10px 20px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#007BFF",
        color: "#FFFFFF",
      }}
    >
      {/* Left Side: ZETTAJOBS */}
      <Link
        to="/home"
        className="navbar-brand"
        style={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          color: "#000000",
          textDecoration: "none",
        }}
      >
        ZETTAJOBS
      </Link>


      {/* Right Side: Logout */}
      { (
        <button
          className="btn btn-danger"
          onClick={handleLogout}
          style={{
            textAlign: "right",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;