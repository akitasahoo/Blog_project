const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

// =========================
// SIGNUP PAGE
// =========================
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// =========================
// SIGNUP
// =========================
router.post("/signup", authController.signup);

// =========================
// LOGIN PAGE
// =========================
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// =========================
// LOGIN
// =========================
router.post("/login", authController.login);

// =========================
// LOGOUT
// =========================
router.get("/logout", authController.logout);

// =========================
// FORGOT PASSWORD PAGE
// =========================
router.get("/forgot-password", (req, res) => {
  res.render("auth/forgot-password");
});

// =========================
// FORGOT PASSWORD
// =========================
router.post("/forgot-password", authController.forgotPassword);

// =========================
// RESET PASSWORD PAGE
// =========================
router.get("/reset-password", (req, res) => {
  res.render("auth/reset-password");
});

// =========================
// RESET PASSWORD
// =========================
router.post("/reset-password", authController.resetPassword);

module.exports = router;