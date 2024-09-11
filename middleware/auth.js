const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verified);
    console.log(token);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send("Unauthorized User");
  }
};
module.exports = auth;
