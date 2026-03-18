const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load env variables
dotenv.config();

// DB connection
const connectDB = require("./config/db");

// Route imports
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Ascendia Backend Running 🚀");
});

// API Routes
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);

// 404 Handler (optional but good)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});