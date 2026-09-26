const User = require("../models/User");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

// =========================
// ADMIN DASHBOARD
// =========================
exports.dashboard = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const blogs = await Blog.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    const comments = await Comment.find()
      .populate("user", "name")
      .populate("blog", "title")
      .sort({ createdAt: -1 });

    res.render("admin/dashboard", {
      users,
      blogs,
      comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load admin dashboard");
  }
};

// =========================
// DELETE USER
// =========================
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await User.findByIdAndDelete(userId);

    // Delete user's blogs
    const blogs = await Blog.find({ author: userId });

    const blogIds = blogs.map((blog) => blog._id);

    await Blog.deleteMany({
      author: userId
    });

    // Delete comments of user
    await Comment.deleteMany({
      user: userId
    });

    // Delete comments from user's blogs
    await Comment.deleteMany({
      blog: { $in: blogIds }
    });

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("User deletion failed");
  }
};

// =========================
// ADMIN DELETE BLOG
// =========================
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    await Blog.findByIdAndDelete(blogId);

    await Comment.deleteMany({
      blog: blogId
    });

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Blog deletion failed");
  }
};

// =========================
// ADMIN DELETE COMMENT
// =========================
exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Comment deletion failed");
  }
};