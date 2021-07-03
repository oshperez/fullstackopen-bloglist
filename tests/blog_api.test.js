const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("when there are blogs saved in the database ", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("unique identifier of blog posts is named 'id'", async () => {
    const blogs = await helper.blogsInDb();
    const blogId = blogs[0]["id"];
    expect(blogId).toBeDefined();
  });
});

describe("when adding blogs", () => {
  test("a new blog can be added", async () => {
    const newBlog = {
      title: "faucibus adipiscing molestie consectetuer adipiscing",
      author: "Martin Green",
      url: "https://magiclorem.com/ublicuos",
      likes: 233330,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const titles = response.body.map((blog) => blog.title);
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    expect(titles).toContain(
      "faucibus adipiscing molestie consectetuer adipiscing"
    );
  });

  test("if likes property is missing it defaults to 0", async () => {
    const blogWithoutLikes = {
      title: "in hac habitasse platea",
      author: "Luke James",
      url: "https://tripiti.com/alleluia",
    };

    await api
      .post("/api/blogs")
      .send(blogWithoutLikes)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const allBlogs = await helper.blogsInDb();
    const lastBlog = allBlogs[helper.initialBlogs.length];

    expect(lastBlog.likes).toBe(0);
  });

  test("if title and url are missing, server responds with 400 status", async () => {
    const incompleteBlog = {
      title: "",
      author: "Miriam Gates",
      url: "",
      likes: 20098,
    };

    await api.post("/api/blogs").send(incompleteBlog).expect(400);
  });
});

describe("when updating a blog", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const replacementBlog = { ...blogToUpdate, likes: 1000000 };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(replacementBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd[0];

    expect(updatedBlog.likes).toBe(1000000);
    expect(blogsAtEnd).toContainEqual(replacementBlog);
  });
});

describe("when deleting a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);

    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("when there is initially one user in the datebase", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("classified", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

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

afterAll(() => {
  mongoose.connection.close();
});
