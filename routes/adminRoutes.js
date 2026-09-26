const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");

const {
  isLoggedIn,
  isAdmin
} = require("../middleware/authMiddleware");

// =========================
// ADMIN DASHBOARD
// =========================

router.get(
  "/dashboard",
  isLoggedIn,
  isAdmin,
  adminController.dashboard
);

// =========================
// DELETE USER
// =========================

router.post(
  "/user/delete/:id",
  isLoggedIn,
  isAdmin,
  adminController.deleteUser
);

// =========================
// DELETE BLOG
// =========================

router.post(
  "/blog/delete/:id",
  isLoggedIn,
  isAdmin,
  adminController.deleteBlog
);

// =========================
// DELETE COMMENT
// =========================

router.post(
  "/comment/delete/:id",
  isLoggedIn,
  isAdmin,
  adminController.deleteComment
);

module.exports = router;