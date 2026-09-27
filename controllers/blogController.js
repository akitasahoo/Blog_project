const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

// GET ALL BLOGS
exports.getAllBlogs = async (req, res) => {
    try {
        const search = req.query.search || "";
        const category = req.query.category || "";

        let filter = {};

        // Search filter
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }

        // Category filter
        if (category) {
            filter.category = category;
        }

        const blogs = await Blog.find(filter)
            .populate("author", "name")
            .sort({ createdAt: -1 });

        // Get all categories
        const categories = await Blog.distinct("category");

        res.render("home", {
            blogs,
            categories,
            search,
            selectedCategory: category,
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

// GET SINGLE BLOG
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


// SHOW CREATE BLOG PAGE
exports.showCreateBlog = (req, res) => {
    res.render("blogs/create");
};


// CREATE BLOG
exports.createBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            category
        } = req.body;

        let imagePath = "";

        if (req.file) {
            imagePath = "/uploads/" + req.file.filename;
        }

        await Blog.create({
            title,
            content,
            image: imagePath,
            category,
            author: req.session.userId
        });

        res.redirect("/");

    } catch (error) {
        console.error(error);
        res.status(500).send("Blog creation failed");
    }
};


// SHOW EDIT BLOG PAGE
exports.showEditBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).send("Blog not found");
        }

        res.render("blogs/edit", {
            blog
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to open edit page");
    }
};


// UPDATE BLOG
exports.updateBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            category
        } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).send("Blog not found");
        }

        blog.title = title;
        blog.content = content;
        blog.category = category;

        if (req.file) {
            blog.image = "/uploads/" + req.file.filename;
        }

        await blog.save();

        res.redirect(`/blog/${req.params.id}`);

    } catch (error) {
        console.error(error);
        res.status(500).send("Blog update failed");
    }
};


// DELETE BLOG
exports.deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);

        await Comment.deleteMany({
            blog: req.params.id
        });

        res.redirect("/");

    } catch (error) {
        console.error(error);
        res.status(500).send("Blog deletion failed");
    }
};