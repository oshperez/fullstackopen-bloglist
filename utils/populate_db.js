const mongoose = require("mongoose");
const Blog = require("../models/blog");
const config = require("./config");
const helper = require("../tests/test_helper");
const logger = require("./logger");

const populateDb = async () => {
  logger.info(`Conecting to ${config.MONGODB_URI}`);

  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  logger.info(`Conected to MongoDb ${config.MONGODB_URI}`);
  logger.info(`Deleting previous data from database...`);

  await Blog.deleteMany({});

  logger.info(`Populating database...`);
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

  mongoose.connection.close();
  logger.info(`Done!`);
};

populateDb();
