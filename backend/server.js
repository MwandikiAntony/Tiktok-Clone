const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/video", require("./routes/video"));
app.use("/comment", require("./routes/comment"));

app.listen(process.env.PORT, () =>
  console.log("Server running on " + process.env.PORT)
);
