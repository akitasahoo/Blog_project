const Comment = require("../models/Comment");

// =========================
// ADD COMMENT
// =========================
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.send("Comment cannot be empty");
    }

    await Comment.create({
      text: text.trim(),
      user: req.session.userId,
      blog: req.params.blogId
    });

    res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Comment failed");
  }
};

// =========================
// DELETE COMMENT
// =========================
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    // User can delete only their own comment
    if (
      comment.user.toString() !==
      req.session.userId.toString()
    ) {
      return res.status(403).send("You cannot delete this comment");
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.redirect(`/blog/${comment.blog}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Comment deletion failed");
  }
};