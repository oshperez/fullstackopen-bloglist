const express = require("express");
const app = express();
const mongoose = require("mongoose");
const middleware = require("./utils/middleware");
require("express-async-errors");
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logger = require("./utils/logger");
const config = require("./utils/config");

logger.info(`Conecting to ${config.MONGODB_URI}`);

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    logger.info(`Conected to ${config.MONGODB_URI}`);
  } catch (error) {
    logger.error(`Conection to MongoDB failed :( ${error}`);
  }
})();

app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor)

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.errorHandler);

module.exports = app;
