import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        email,
        password,
      });
      const { applicantId, recruiterId } = response.data;

      if (applicantId) {
        sessionStorage.setItem("applicantId", applicantId);
        sessionStorage.setItem("applicantName", response.data.applicantName); // Add this line
        alert("Login successful!");
        navigate("/applicant-dashboard");
      } else if (recruiterId) {
        sessionStorage.setItem("recruiterId", recruiterId);
        sessionStorage.setItem("recruiterName", response.data.recruiterName); // Add this line
        alert("Recruiter login successful!");
        navigate("/recruiter-dashboard");
      } else {
        alert("Login failed. User ID not found.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        backgroundColor: "#E6F7FF", // Pale blue background
      }}
    >
      {/* ZETTAJOBS Header */}
      <div
        className="text-center mb-4"
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#007BFF",
        }}
      >
        ZETTAJOBS
      </div>

      {/* Login Container */}
      <div
        className="login-container"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "#FFFFFF", // White background for the form
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for better appearance
          padding: "20px",
        }}
      >
        <h4 className="text-center">Your Gateway to find Jobs or Talent</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Login
          </button>
          <p className="text-center mt-3">Don't have an account?</p>
          <Link
            to="/signup"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
            style={{
              textAlign: "center",
              padding: "10px",
              display: "block",
            }}
          >
            Signup
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;