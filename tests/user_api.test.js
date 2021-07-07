const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("classified", 10);
  const user = new User({ username: "root", passwordHash });
  await user.save();
});

describe("when there is initially one user in the datebase", () => {
  test("a new user can be successfully created", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "fmcbeen",
      name: "Flavia Mackbeen",
      password: "flabeen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creating a new user fails if username is already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "anonymous",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test(`creating a new user fails if username and/or password are not 
        provided`, async () => {
    const usersAtStart = await helper.usersInDb();

    const userWithMissingCredentials = {
      username: "",
      name: "Bad User",
      password: "",
    };

    const result = await api
      .post("/api/users")
      .send(userWithMissingCredentials)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("missing credential");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
  test(`creating a new user fails if username and/or password are not at 
        least 3 characters long`, async () => {
    const usersAtStart = await helper.usersInDb();

    const userWithMissingCredentials = {
      username: "az",
      name: "Wrong User",
      password: "r",
    };

    const result = await api
      .post("/api/users")
      .send(userWithMissingCredentials)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("invalid credentials");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
