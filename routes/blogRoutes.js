const express = require("express");

const router = express.Router();

const blogController = require("../controllers/blogController");

const {
    isLoggedIn,
    isAdmin
} = require("../middleware/authMiddleware");


// =========================
// CREATE BLOG
// =========================

router.get(
    "/blog/create",
    isLoggedIn,
    isAdmin,
    blogController.showCreateBlog
);

router.post(
    "/blog/create",
    isLoggedIn,
    isAdmin,
    blogController.createBlog
);


// =========================
// EDIT BLOG
// =========================

router.get(
    "/blog/edit/:id",
    isLoggedIn,
    isAdmin,
    blogController.showEditBlog
);

router.post(
    "/blog/edit/:id",
    isLoggedIn,
    isAdmin,
    blogController.updateBlog
);


// =========================
// DELETE BLOG
// =========================

router.post(
    "/blog/delete/:id",
    isLoggedIn,
    isAdmin,
    blogController.deleteBlog
);


// =========================
// VIEW SINGLE BLOG
// =========================

router.get(
    "/blog/:id",
    blogController.getSingleBlog
);


// =========================
// HOME
// =========================

router.get(
    "/",
    blogController.getAllBlogs
);


module.exports = router;