const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

// Get all users
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { user: 0 });
  response.json(users);
});

// Create new user
usersRouter.post("/", async (request, response) => {
  const body = request.body;
  if (!body.username || !body.password) {
    return response.status(400).json({ error: "missing credential" });
  }

  if (body.username.length < 3 || body.password.length < 3) {
    return response.status(400).json({ error: "invalid credentials" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = usersRouter;
