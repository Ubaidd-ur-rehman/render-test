const Joi = require("joi");
const mongoose = require("mongoose");
const Course = require("./Course"); // Correct import

// Use Course.schema to access the schema from the Course model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    minLength: 3,
    maxLength: 10,
  },
  email: String,
  password: String,
  rollNo: { type: Number, required: true },
  course: [Course.schema],
  // course:mongoose.Schema.Type.ObjectId,
  // ref:Course,

});

// Joi validation function for User model
const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).lowercase().required().messages({
      "string.min": "Name must be at least 3 characters long.",
      "string.max": "Name must be no more than 10 characters long.",
      "any.required": "Name is required.",
    }),

    email: Joi.string().email().messages({
      "string.email": "Please enter a valid email address.",
    }),

    password: Joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters long.",
      "any.required": "Password is required.",
    }),

    rollNo: Joi.number().required().messages({
      "any.required": "Roll number is required.",
    }),
  });

  return schema.validate(user);
};

// Export User model and validateUser function
module.exports = {
  User: mongoose.model("User", userSchema),
  validate: validateUser,
};
