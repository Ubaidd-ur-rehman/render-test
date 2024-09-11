const express = require("express");
const Course = require("../models/Course");
const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).send(courses);
  } catch (error) {
    console.log("Error fetching courses: ", error);
    res.status(500).send("Error fetching courses");
  }
});

// Create a new course
router.post("/", async (req, res) => {
  const course = req.body;

  try {
    // Check if the course already exists in the database
    const dbCourse = await Course.findOne({ name: course.name });
    if (dbCourse) {
      return res.status(400).send("Course already exists");
    }

    // Create and save the new course
    const newCourse = new Course(course);
    const savedCourse = await newCourse.save();
    res.status(201).send(savedCourse);
  } catch (error) {
    console.log("Error creating course: ", error);
    res.status(500).send("Error creating course");
  }
});

module.exports = router;
