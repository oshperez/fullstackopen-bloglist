const mongoose = require("mongoose");
require("dotenv").config();
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const Blog = require("../models/blog");
const User = require("../models/user");

describe("when there are blogs saved in the database", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

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

describe("when updating a blog", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

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

describe("when adding a blog using token authentication", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const user = {
      username: "jrduran",
      name: "Jordan Duran",
      password: "jran",
    };

    await api.post("/api/users").send(user);

    const response = await api.post("/api/login").send(user);
    process.env.TOKEN = response.body.token;
  });

  test("it succeeds if a valid token is provided", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const token = process.env.TOKEN;

    const newBlog = {
      title: "faucibus adipiscing molestie consectetuer adipiscing",
      author: "Martin Green",
      url: "https://magiclorem.com/ublicuos",
      likes: 233330,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api
      .get("/api/blogs")
      .set("Authorization", `bearer ${token}`);

    const titles = response.body.map((blog) => blog.title);
    expect(response.body).toHaveLength(blogsAtStart.length + 1);
    expect(titles).toContain(
      "faucibus adipiscing molestie consectetuer adipiscing"
    );
  });

  test("it fails with status code 400 if token is not provided", async () => {
    const newBlog = {
      title: "lorem iptsum",
      author: "Gary Miller",
      url: "https://magiclorem.com/ublicuos",
      likes: 233330,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", "")
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toContain("jwt must be provided");
  });

  test("if likes property is missing it defaults to 0", async () => {
    const blogWithoutLikes = {
      title: "in hac habitasse platea",
      author: "Luke James",
      url: "https://tripiti.com/alleluia",
    };
    const token = process.env.TOKEN;

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(blogWithoutLikes)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const allBlogs = await helper.blogsInDb();
    const lastBlog = allBlogs[allBlogs.length - 1];

    expect(lastBlog.likes).toBe(0);
  });

  test("if title and/or url are missing, server responds with 400 status", async () => {
    const incompleteBlog = {
      title: "",
      author: "Miriam Gates",
      url: "",
      likes: 20098,
    };

    const token = process.env.TOKEN;
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(incompleteBlog)
      .expect(400);

    expect(response.body.error).toContain("title or url missing");
  });
});

describe("when deleting a blog using token authentication", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const blog = {
      title: "in hac habitasse platea",
      author: "Luke James",
      url: "https://tripiti.com/alleluia",
      likes: 100,
    };

    const user = {
      username: "jrduran",
      name: "Jordan Duran",
      password: "jran",
    };

    await api.post("/api/users").send(user);

    const response = await api.post("/api/login").send(user);
    process.env.TOKEN = response.body.token;

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${response.body.token}`)
      .send(blog)
      .expect(201);
  });

  test("succeeds with status code 204 if id and token are valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    const token = process.env.TOKEN;
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
