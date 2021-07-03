const Blog = require("../models/blog");
const User = require("../models/user");

initialBlogs = [
  {
    title: "iaculis congue vivamus metus arcu adipiscing molestie hendrerit",
    author: "Channa Rodgman",
    url: "http://wired.com/viverra.jpg",
    likes: 99780,
  },
  {
    title: "ut odio cras mi pede",
    author: "Vincenz Alenichicov",
    url: "http://squarespace.com/odio/curabitur/convallis/duis/consequat.jpg",
    likes: 33053,
  },
  {
    title: "quis lectus suspendisse",
    author: "Rusty Baford",
    url: "https://answers.com/aliquet/at/feugiat/non/pretium/quis/lectus.png",
    likes: 60532,
  },
  {
    title: "diam neque vestibulum eget",
    author: "Windham Donwell",
    url: "http://dailymotion.com/cubilia/curae/nulla.xml",
    likes: 98463,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
};
