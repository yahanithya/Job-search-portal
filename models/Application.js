const mongoose = require("mongoose");

// Application Schema
const applicationSchema = new mongoose.Schema({
  name: String,
  institute: String,
  endYear: Number,
  dob: Date,
  degree: String,
  cgpa: Number,
  skills: String,
  photo: String,
  resume: String,
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "JobApplicant", required: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter" },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" },
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;