const mongoose = require("mongoose");

// Define Mongoose schema for Course model
const CourseSchema = new mongoose.Schema({
  code: String,
  name: String,
  duration: Number,
  description: String,
  fee: Number,
  credit: Number,
});

// Export Course model
module.exports = mongoose.model("Course", CourseSchema);
