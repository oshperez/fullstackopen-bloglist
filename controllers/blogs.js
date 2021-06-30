const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  
  if (blog.title === undefined || blog.url === undefined) {
    return response.status(400).end();
  } else if (blog.likes === undefined) {
    blog.likes = 0;
  }

  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const { title, author, url, likes } = request.body;
  const blog = { title, author, url, likes };

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
  response.json(updatedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;

  await Blog.findByIdAndRemove(id);
  response.status(204).end();
});

module.exports = blogsRouter;
