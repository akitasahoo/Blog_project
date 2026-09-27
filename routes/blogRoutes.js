const express = require("express");
const router = express.Router();

const multer = require("multer");

const blogController = require("../controllers/blogController");

const {
    isLoggedIn,
    isAdmin
} = require("../middleware/authMiddleware");


// =========================
// MULTER IMAGE STORAGE
// =========================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    }

});

const upload = multer({
    storage: storage
});


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
    upload.single("image"),
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
    upload.single("image"),
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