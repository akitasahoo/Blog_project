const express = require("express");

const router = express.Router();

const blogController = require("../controllers/blogController");

const {
  isLoggedIn,
  isAdmin
} = require("../middleware/authMiddleware");

// =========================
// SHOW ALL BLOGS
// =========================

router.get("/", blogController.getAllBlogs);

// =========================
// SHOW SINGLE BLOG
// =========================

router.get("/blog/:id", blogController.getSingleBlog);

// =========================
// CREATE BLOG PAGE
// ADMIN ONLY
// =========================

router.get(
  "/blog/create",
  isLoggedIn,
  isAdmin,
  blogController.showCreateBlog
);

// =========================
// CREATE BLOG
// ADMIN ONLY
// =========================

router.post(
  "/blog/create",
  isLoggedIn,
  isAdmin,
  blogController.createBlog
);

// =========================
// EDIT BLOG PAGE
// ADMIN ONLY
// =========================

router.get(
  "/blog/edit/:id",
  isLoggedIn,
  isAdmin,
  blogController.showEditBlog
);

// =========================
// UPDATE BLOG
// ADMIN ONLY
// =========================

router.post(
  "/blog/edit/:id",
  isLoggedIn,
  isAdmin,
  blogController.updateBlog
);

// =========================
// DELETE BLOG
// ADMIN ONLY
// =========================

router.post(
  "/blog/delete/:id",
  isLoggedIn,
  isAdmin,
  blogController.deleteBlog
);

module.exports = router;