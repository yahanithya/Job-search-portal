const mongoose = require("mongoose");

// Define the Job Schema
const jobSchema = new mongoose.Schema({
  designation: { type: String, required: true },
  companyName: { type: String, required: true },
  jobDescription: { type: String, required: true },
  salary: { type: String },
  experience: { type: String },
  location: { type: String },
  employmentType: { type: String },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter' },
  logo: { type: String }, // Path to the uploaded logo file
});

// Create the Job model
const Job = mongoose.model("Job", jobSchema);

module.exports = Job;