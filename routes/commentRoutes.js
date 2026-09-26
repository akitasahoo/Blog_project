const express = require("express");

const router = express.Router();

const commentController = require("../controllers/commentController");

const {
  isLoggedIn
} = require("../middleware/authMiddleware");

// =========================
// ADD COMMENT
// LOGIN REQUIRED
// =========================

router.post(
  "/comment/:blogId",
  isLoggedIn,
  commentController.addComment
);

// =========================
// DELETE OWN COMMENT
// LOGIN REQUIRED
// =========================

router.post(
  "/comment/delete/:id",
  isLoggedIn,
  commentController.deleteComment
);

module.exports = router;