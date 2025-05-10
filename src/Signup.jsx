import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "Job Applicant", // Default user type
    institute: "",
    endYear: "",
    companyName: "",
    position: "",
    recruiterId: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    const data = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      userType: formData.userType, // Ensure this is set to "Job Applicant" or "Recruiter"
      institute: formData.institute,
      endYear: formData.endYear,
      companyName: formData.companyName,
      position: formData.position,
      recruiterId: formData.recruiterId,
    };

    try {
      const response = await axios.post("http://localhost:3001/register", data);
      console.log("Registration successful:", response.data);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data being submitted:", formData); // Log the form data

    axios
      .post("http://localhost:3001/register", formData)
      .then((result) => {
        console.log("Signup successful:", result.data);
        localStorage.setItem("userType", result.data.userType); // Store the role
        localStorage.setItem("username", result.data.username); // Store the username
        navigate("/login");
      })
      .catch((err) => {
        console.error("Error during signup:", err.response || err.message || err);
        alert("Signup failed. Please try again.");
      });
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

      {/* Signup Container */}
      <div
        className="signup-container"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "#FFFFFF", // White background for the form
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for better appearance
          padding: "20px",
        }}
      >
        <h2 className="text-center">Signup</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              className="form-control rounded-0"
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className="form-control rounded-0"
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              className="form-control rounded-0"
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="userType">User Type:</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              className="form-control rounded-0"
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="Job Applicant">Job Applicant</option>
              <option value="Recruiter">Recruiter</option>
            </select>
          </div>

          {/* Conditional Fields for Job Applicant */}
          {formData.userType === "Job Applicant" && (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="institute">Institute:</label>
                <input
                  type="text"
                  id="institute"
                  name="institute"
                  value={formData.institute}
                  className="form-control rounded-0"
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="endYear">End Year:</label>
                <input
                  type="number"
                  id="endYear"
                  name="endYear"
                  value={formData.endYear}
                  className="form-control rounded-0"
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>
            </>
          )}

          {/* Conditional Fields for Recruiter */}
          {formData.userType === "Recruiter" && (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="companyName">Company Name:</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  className="form-control rounded-0"
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="position">Position:</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  className="form-control rounded-0"
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="recruiterId">Recruiter ID:</label>
                <input
                  type="text"
                  id="recruiterId"
                  name="recruiterId"
                  value={formData.recruiterId}
                  className="form-control rounded-0"
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Signup
          </button>
          <p className="text-center mt-3">Already Have an Account?</p>
          <Link
            to="/login"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
            style={{
              textAlign: "center",
              padding: "10px",
              display: "block",
            }}
          >
            Login
          </Link>
        </form>
      </div>
    </div>
  );
}

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/login", formData)
      .then((result) => {
        console.log("Backend response:", result.data); // Log the backend response
        if (result.data.message === "Login success") {
          localStorage.setItem("userType", result.data.userType); // Store the user type
          localStorage.setItem("username", result.data.username); // Store the username
          navigate("/home");
        } else {
          alert(result.data.message); // Show the error message from the backend
        }
      })
      .catch((err) => {
        console.error("Error during login:", err.response || err.message || err);
        alert("Login failed. Please try again.");
      });
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
        <h2 className="text-center">Login</h2>
        <h4 className="text-center">Your Gateway to find Jobs or Talent</h4>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className="form-control rounded-0"
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              className="form-control rounded-0"
              onChange={handleChange}
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

export default Signup;