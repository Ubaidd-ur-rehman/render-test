const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Joi schema for validation
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  // Validate user input
  const { error } = schema.validate({ email, password });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send("Incorrect email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("valid password", isValidPassword);

    if (!isValidPassword) {
      return res.status(400).send("Incorrect email or password");
    }

    // Create a token and send it back to the client
    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET
    );
    return res.status(200).send(token);
  } catch (e) {
    return res.status(500).send("An error occurred while logging in");
  }
});

module.exports = router;
