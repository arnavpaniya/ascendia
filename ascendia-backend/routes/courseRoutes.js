const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// Get all courses
router.get("/", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Add course
router.post("/", async (req, res) => {
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.json(newCourse);
});

// Delete course
router.delete("/:id", async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted" });
});

module.exports = router;