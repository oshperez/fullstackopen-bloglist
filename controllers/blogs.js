const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

// Get all blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

// Add a new blog
blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  if (!body.title || !body.url) {
    return response.status(400).json({ error: "missing title and/or url" });
  }

  if (!body.likes) {
    body.likes = 0;
  }
  const count = await User.countDocuments();
  const random = Math.floor(Math.random() * count);
  const user = await User.findOne().skip(random);

  const newBlog = { ...body, user: user.id };

  const blog = new Blog(newBlog);

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  response.status(201).json(savedBlog);
});

// Update a blog
blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const { title, author, url, likes } = request.body;
  const blog = { title, author, url, likes };

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
  response.json(updatedBlog);
});

// Remove a blog
blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;

  await Blog.findByIdAndRemove(id);
  response.status(204).end();
});

module.exports = blogsRouter;
