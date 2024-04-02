const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const admin = require("../models/admin");

const cookieOptions = {
  httpOnly: true,
  maxAge: 3000 * 30 * 24 * 60 * 60, // month in milliseconds
  secure: true, // Set to true in production if using HTTPS
  sameSite: "None",
};

const secretKey = "aaichraqisthebestjaaeyeuenkjdvnkjbnhhjhsdkfbkjnikqsd";

const adminController = {
  login: async (req, res) => {
    const { nationalNum, password } = req.body;

    try {
      // Check if the user with the given email exists
      const existingUser = await admin.findByUsername(nationalNum);
     
      if (!existingUser || !existingUser.nationalNum) {
        // If user doesn't exist, return a 404 error
        return res.status(404).json({ error: "admin not found" });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!passwordMatch) {
        // If passwords don't match, return a 401 error
        return res.status(401).json({ error: "Incorrect password" });
      }
      // Check if the user is verified

      // Generate JWT token with user ID, email
      const token = jwt.sign(
        { adminId: existingUser.id, nationalNum: existingUser.nationalNum },
        secretKey,
        {}
      );

      // Set cookie with JWT token
      res.cookie("Admintoken", token, cookieOptions);

      // If everything is okay, return success
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      // If an unexpected error occurs, return a 500 error
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("Admintoken");
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = adminController;
