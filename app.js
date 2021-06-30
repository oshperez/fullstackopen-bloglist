const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const config = require("./utils/config");

logger.info(`Conecting to ${config.MONGODB_URI}`);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => logger.info(`Conected to MongoDb ${config.MONGODB_URI}`))
  .catch((err) => logger.error(`Error conecting to MongoDb ${err}`));

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use(middleware.errorHandler);

module.exports = app;
