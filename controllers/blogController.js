const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

// =========================
// SHOW ALL BLOGS
// =========================
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.render("home", {
      blogs,
      user: req.session.userId
        ? {
            id: req.session.userId,
            name: req.session.userName,
            role: req.session.role
          }
        : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load blogs");
  }
};

// =========================
// SHOW SINGLE BLOG
// =========================
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name");

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    const comments = await Comment.find({
      blog: blog._id
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.render("blogs/blog", {
      blog,
      comments,
      user: req.session.userId
        ? {
            id: req.session.userId,
            name: req.session.userName,
            role: req.session.role
          }
        : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load blog");
  }
};

// =========================
// SHOW CREATE BLOG PAGE
// =========================
exports.showCreateBlog = (req, res) => {
  res.render("blogs/create");
};

// =========================
// CREATE BLOG
// =========================
exports.createBlog = async (req, res) => {
  try {
    const { title, content, image, category } = req.body;

    await Blog.create({
      title,
      content,
      image,
      category,
      author: req.session.userId
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Blog creation failed");
  }
};

// =========================
// SHOW EDIT PAGE
// =========================
exports.showEditBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    res.render("blogs/edit", { blog });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to open edit page");
  }
};

// =========================
// UPDATE BLOG
// =========================
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, image, category } = req.body;

    await Blog.findByIdAndUpdate(req.params.id, {
      title,
      content,
      image,
      category
    });

    res.redirect(`/blog/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Blog update failed");
  }
};

// =========================
// DELETE BLOG
// =========================
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);

    // Delete comments related to this blog
    await Comment.deleteMany({
      blog: req.params.id
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Blog deletion failed");
  }
};