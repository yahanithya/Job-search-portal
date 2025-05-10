const mongoose = require('mongoose');
const { body, validationResult } = require("express-validator");

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  username: String, // Added field for username
  userType: String,
  companyName: String, // Added field for company name
  position: String, // Added field for position
  recruiterId: String, // Added field for recruiter ID
});

const EmployeeModel = mongoose.model("recruiter", EmployeeSchema);
module.exports = EmployeeModel;

