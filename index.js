const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

const PORT = 5000;

// =========================
// CONNECT MONGODB
// =========================

connectDB();

// =========================
// EJS SETUP
// =========================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// =========================
// BODY PARSER
// =========================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =========================
// STATIC FILES
// =========================

app.use(express.static(path.join(__dirname, "public")));

// =========================
// SESSION
// =========================

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// =========================
// ROUTES
// =========================

app.use("/", authRoutes);
app.use("/", blogRoutes);
app.use("/", commentRoutes);
app.use("/admin", adminRoutes);

// =========================
// SERVER
// =========================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});