const mongoose = require('mongoose');

const JobApplicantSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  username: String, // Added field for username
  userType: String,
  institute: String, // Added field for institute
  endYear: Number, // Added field for end year
});

const JobApplicantModel = mongoose.model("jobapplicant", JobApplicantSchema);
module.exports = JobApplicantModel;