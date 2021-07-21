const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../utils/middleware");

// Get all blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

// Add a new blog
blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  
  const decodedToken = request.user;
  if (!body.title || !body.url) {
    return response.status(400).json({ error: "title or url missing" });
  }
  if (!body.likes) {
    body.likes = 0;
  }
  const user = await User.findById(decodedToken.id);

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
blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;

    const id = request.params.id;
    const blog = await Blog.findById(id);

    if (!(blog.user.toString() === user.id.toString())) {
      return response.status(401).json({ error: "unauthorized token" });
    }

    await Blog.findByIdAndRemove(id);
    response.status(204).end();
  }
);

module.exports = blogsRouter;
