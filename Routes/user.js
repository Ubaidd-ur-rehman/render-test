const express = require("express");
const { User, validate } = require("../models/user"); // Import the User model and validate function
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth"); // Import any required middleware
const router = express.Router();
const Joi = require("joi");
// const { populate } = require("../models/Course");

// Define validation schema outside the function to reuse it
const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name cannot be empty.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must be at most 50 characters long.",
    "any.required": "Name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "Password is required.",
  }),
});

// Validation function for user input using Joi
const validateUser = (user) => {
  return userValidationSchema.validate(user);
};

// Get all users or filter users based on query
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 3, ...filters } = req.query;

    // Apply filters if provided, otherwise fetch all users with pagination
    // const users = User.find().("course")
    // res.send(users)
    const query = filters ? User.find(filters) : User.find();
    const users = await query
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select("-password"); // Exclude password from the result

    console.log("Fetched Users: ", users);
    return res.send(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    return res.status(500).send("Error fetching users");
  }
});

// Create a new user
router.post("/", async (req, res) => {
  const user = req.body;

  // Validate user input using the Joi validation function
  const { error } = validateUser(user); // Fixed to use validateUser
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Check if user already exists
    const dbUser = await User.findOne({ email: user.email });
    if (dbUser) return res.status(400).send("User already exists");

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Create and save the new user
    const newUser = new User(user);
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (error) {
    console.log("Error creating user: ", error);
    res.status(500).send("Error creating user");
  }
});

// Get user by specific ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password from the result
    if (!user) {
      return res.status(404).send("User not found");
    }
    console.log("User with ID: ", user);
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID: ", error);
    return res.status(500).send("Error fetching user by ID");
  }
});

// Update user by specific ID - PUT request
// router.put("/:id/:courseId"){

// }
router.put("/:id", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  console.log("Params", req.params);
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Ensure updated data is validated
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).send("user not found ");
    }
    // user.course.push(req.params.courseId)
    // const updatedUser = user.save()
    // return res.send(req.params);
    console.log("Updated User: ", updatedUser);
    return res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user: ", error);
    return res.status(500).send("Error updating user");
  }
});

// Update user partially by specific ID - PATCH request
router.patch("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    console.log("Updated User (PATCH): ", updatedUser);
    return res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user (PATCH): ", error);
    return res.status(500).send("Error updating user (PATCH)");
  }
});

module.exports = router;
