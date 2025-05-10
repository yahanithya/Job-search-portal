const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const EmployeeModel = require("./models/Employee");
const JobApplicantModel = require("./models/Jobapplicant");
const Job = require("./models/Jobs"); // Import the Job model
const Application = require("./models/Application"); // Import the Application model
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "uploads" directory
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Register API
app.post("/register", async (req, res) => {
  const { username, email, password, userType, institute, endYear, companyName, position, recruiterId } = req.body;

  try {
    console.log("Register Request Body:", req.body); // Log the request body

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    if (userType === "Job Applicant") {
      const applicant = await JobApplicantModel.create({ username, email, password: hashedPassword, institute, endYear });
      return res.status(201).json({ message: "Job Applicant registered successfully", userType });
    } else if (userType === "Recruiter") {
      const recruiter = await EmployeeModel.create({ username, email, password: hashedPassword, companyName, position, recruiterId });
      return res.status(201).json({ message: "Recruiter registered successfully", userType });
    } else {
      console.error("Invalid user type:", userType); // Log the invalid user type
      return res.status(400).json({ message: "Invalid user type" });
    }
  } catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Login API
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if the user is a job applicant
    const applicant = await JobApplicantModel.findOne({ email });
    if (applicant) {
      const isPasswordValid = await bcrypt.compare(password, applicant.password);
      if (isPasswordValid) {
        return res.json({
          message: "Login success",
          username: applicant.username,
          userType: "Applicant",
          applicantId: applicant._id,
        });
      }
    }

    // Check if the user is a recruiter
    const recruiter = await EmployeeModel.findOne({ email });
    if (recruiter) {
      const isPasswordValid = await bcrypt.compare(password, recruiter.password);
      if (isPasswordValid) {
        return res.json({
          message: "Login success",
          username: recruiter.username,
          userType: "Recruiter",
          recruiterId: recruiter._id,
          recruiterName: recruiter.username, // Include recruiterName
        });
      }
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("Error during login:", err.message || err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Create the "uploads" directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Add Job Endpoint
app.post("/api/jobs", upload.single("logo"), async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the request body
    console.log("Uploaded File:", req.file); // Log the uploaded file

    const { designation, companyName, jobDescription, salary, experience, location, employmentType, recruiterId } = req.body;

    // Validate required fields
    if (!designation || !companyName || !jobDescription || !recruiterId) {
      console.error("Validation failed: Missing required fields");
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Create a new job entry
    const newJob = new Job({
      designation,
      companyName,
      jobDescription,
      salary,
      experience,
      location,
      employmentType,
      recruiterId,
      logo: req.file ? `/uploads/${req.file.filename}` : null, // Save file path if uploaded
    });

    // Save the job to the database
    await newJob.save();

    console.log("New Job Saved:", newJob);
    res.status(201).json({ message: "Job added successfully!", job: newJob });
  } catch (error) {
    console.error("Error adding job:", error); // Log the error
    res.status(500).json({ message: "Failed to add job" });
  }
});

// Get Jobs for Recruiter
app.get("/api/recruiter/jobs", async (req, res) => {
  const { recruiterId } = req.query; // Get recruiterId from query parameters

  try {
    // Fetch jobs posted by the recruiter
    const jobs = await Job.find({ recruiterId });
    console.log("Jobs fetched for recruiter:", jobs); // Debugging log

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for this recruiter." });
    }

    res.json(jobs); // Send the jobs back to the frontend
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Jobs for Applicants
app.get("/api/applicant/jobs", async (req, res) => {
  try {
    const jobs = await Job.find(); // Fetch all jobs for applicants
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching applicant jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// API Endpoint to Submit Application
app.post("/api/apply", upload.fields([{ name: "photo" }, { name: "resume" }]), async (req, res) => {
  try {
    const { name, institute, endYear, dob, degree, cgpa, skills, jobId, applicantId } = req.body;
    const photo = req.files["photo"]?.[0]?.path;
    const resume = req.files["resume"]?.[0]?.path;

    if (!name || !institute || !jobId || !applicantId) {
      console.error("Validation failed: Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      console.error("Job not found for jobId:", jobId);
      return res.status(404).json({ message: "Job not found" });
    }
    const recruiterId = job.recruiterId;

    const application = new Application({
      name,
      institute,
      endYear,
      dob,
      degree,
      cgpa,
      skills,
      photo,
      resume,
      jobId,
      applicantId, // Ensure applicantId is included
      recruiterId,
    });

    await application.save();
    console.log("Application saved successfully:", application);
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error saving application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// API Endpoint to Submit a Job Application
app.post("/api/applications", upload.fields([{ name: "photo" }, { name: "resume" }]), async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body
    console.log("Request files:", req.files); // Log uploaded files (if any)

    const { jobId, applicantId, name, institute, endYear, dob, degree, cgpa, skills } = req.body;
    const photo = req.files?.photo?.[0]?.path;
    const resume = req.files?.resume?.[0]?.path;

    if (!jobId || !applicantId || !name || !institute || !endYear || !dob || !degree || !cgpa || !skills) {
      console.error("Validation failed: Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      console.error("Job not found for jobId:", jobId);
      return res.status(404).json({ message: "Job not found" });
    }

    const application = new Application({
      jobId,
      applicantId: applicant._Id, // Ensure applicantId is included
      recruiterId: job.recruiterId,
      name,
      institute,
      endYear,
      dob,
      degree,
      cgpa,
      skills,
      photo,
      resume,
      status: "Pending",
      appliedAt: new Date(),
    });

    await application.save();
    console.log("Application saved successfully:", application);
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error saving application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get Applications Endpoint
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find().populate("jobId");
    res.status(200).send(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).send({ error: "Failed to fetch applications" });
  }
});

// API Endpoint to Fetch Applications for a Specific Applicant
app.get("/api/applications/:applicantId", async (req, res) => {
  const { applicantId } = req.params;

  try {
    const applications = await Application.find({ applicantId }).populate("jobId"); // Assuming `jobId` is a reference
    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// API Endpoint to Fetch Applications for a Specific Job (Recruiter's View)
app.get("/api/job-applications/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    // Fetch applications for the given jobId and populate applicant details
    const applications = await Application.find({ jobId }).populate("applicantId");
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ message: "Failed to fetch job applications." });
  }
});

// API Endpoint to Fetch Applications for a Recruiter
app.get("/api/recruiter/applications", async (req, res) => {
  try {
    const { recruiterId } = req.query;

    console.log("Recruiter ID received:", recruiterId); // Debugging log

    if (!recruiterId) {
      return res.status(400).json({ message: "Recruiter ID is required" });
    }

    // Fetch applications for the recruiter and populate job and applicant details
    const applications = await Application.find({ recruiterId })
      .populate("jobId", "designation location")
      .populate("applicantId", "name email skills");

    console.log("Applications fetched:", applications); // Debugging log

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// API Endpoint to Accept an Application
app.post("/api/recruiter/applications/:id/accept", async (req, res) => {
  const { id } = req.params;
  try {
    await Application.findByIdAndUpdate(id, { status: "Accepted" });
    res.status(200).send("Application accepted.");
  } catch (error) {
    res.status(500).send("Error accepting application.");
  }
});

app.put("/api/applications/:applicationId/accept", async (req, res) => {
  const { applicationId } = req.params;

  try {
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status: "Accepted" },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json({ message: "Application accepted successfully", application });
  } catch (err) {
    console.error("Error accepting application:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// API Endpoint to Reject an Application
app.post("/api/recruiter/applications/:id/reject", async (req, res) => {
  const { id } = req.params;
  try {
    await Application.findByIdAndUpdate(id, { status: "Rejected" });
    res.status(200).send("Application rejected.");
  } catch (error) {
    res.status(500).send("Error rejecting application.");
  }
});

app.put("/api/applications/:applicationId/reject", async (req, res) => {
  const { applicationId } = req.params;

  try {
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status: "Rejected" },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json({ message: "Application rejected successfully", application });
  } catch (err) {
    console.error("Error rejecting application:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// API Endpoint to Delete an Application
app.delete("/api/applications/:applicationId", async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Delete the application from the database
    await Application.findByIdAndDelete(applicationId);

    res.status(200).json({ message: "Application deleted successfully!" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Failed to delete application." });
  }
});

// API Endpoint to Update a Job
app.put("/api/jobs/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, { new: true });
    res.json({ message: "Job updated successfully", job: updatedJob });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/jobs/:jobId", async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId); // Replace `Job` with your job model
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ job });
  } catch (err) {
    console.error("Error fetching job details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// API Endpoint to Fetch All Jobs (Optional)
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    console.log("All jobs fetched:", jobs); // Debugging log

    res.json(jobs); // Send all jobs back to the frontend
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/applicants/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Applicant ID is required" });
  }

  try {
    const applicant = await Applicant.findById(id);
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }
    res.status(200).json(applicant);
  } catch (err) {
    console.error("Error fetching applicant:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/recruiter/stats", async (req, res) => {
  try {
    const { recruiterId } = req.query;

    if (!recruiterId) {
      return res.status(400).json({ message: "Recruiter ID is required" });
    }

    // Fetch total jobs posted by the recruiter
    const totalJobs = await Job.countDocuments({ recruiterId });

    // Fetch total applications received for the recruiter's jobs
    const jobs = await Job.find({ recruiterId });
    const jobIds = jobs.map((job) => job._id);
    const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });

    res.status(200).json({ totalJobs, totalApplications });
  } catch (error) {
    console.error("Error fetching recruiter stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});