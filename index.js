require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const userRouter = require("./Routes/user");
const authRouter = require("./Routes/auth");
const courseRouter = require("./Routes/courses");
const app = express();
// Middleware to parse JSON requests
app.use(express.json());

// Custom middleware to check if 'name' is present in the request body
app.use((req, res, next) => {
  console.log("Hello from middleware");
  if (req.body.name) {
    next(); // Continue to the next middleware or route handler
  } else {
    return res.status(400).send("No 'name' field detected in the request body"); // Respond with a 400 Bad Request status
  }
});

// MongoDB connection string
const connectionString = process.env.MONGO_DB_URL;
console.log("MONGO_DB_URL", connectionString);

// Connect to MongoDB using Mongoose
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

// Define routes
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/course", courseRouter);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
