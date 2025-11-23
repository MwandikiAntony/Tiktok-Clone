const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const connectDB = require("./config/db");

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/video", require("./routes/video"));
app.use("/comment", require("./routes/comment"));

// Serve uploads statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check route
app.get("/", (req, res) => res.send("API is running..."));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
