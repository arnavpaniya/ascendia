const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// Login (basic)
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.password !== req.body.password) {
    return res.status(400).json({ message: "Invalid password" });
  }

  res.json(user);
});

module.exports = router;