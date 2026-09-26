const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

const PORT = 5000;

// Connect MongoDB
connectDB();

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});