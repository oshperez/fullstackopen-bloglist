const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../utils/logger");

router.post("/reset", async (request, response) => {
  console.log("resetting database...")

  await Blog.deleteMany({});
  await User.deleteMany({});
  
  console.log("resetting database done!")

  response.status(204).end();
});

module.exports = router;
