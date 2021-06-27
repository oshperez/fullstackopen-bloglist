const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const likeArr = blogs.map((blog) => blog.likes);
  const totalLikes = likeArr.reduce((total, likes) => total + likes);
  return totalLikes;
};

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((a, b) => (a.likes > b.likes ? a : b));
  const { title, author, likes } = favorite;
  favoriteSimpified = { title, author, likes };

  return favoriteSimpified;
};

const mostBlogs = (blogs) => {
  const allAuthors = blogs.reduce((authors, blog) => {
    if (!authors.some((author) => author === blog.author)) {
      return authors.concat(blog.author);
    }
    return authors;
  }, []);

  const numbersOfBlogs = allAuthors.map((author) => {
    return blogs.reduce((blogTotal, blog) => {
      if (blog.author === author) {
        return blogTotal + 1;
      }
      return blogTotal;
    }, 0);
  });

  const maxBlogNum = Math.max(...numbersOfBlogs);
  const topAuthorName = allAuthors[numbersOfBlogs.indexOf(maxBlogNum)];

  return { author: topAuthorName, blogs: maxBlogNum };
};

const mostLikes = (blogs) => {
  return blogs.reduce(
    (author, blog) => {
      if (blog.likes > author.likes) {
        const {author, likes} = blog
        return { author, likes};
      }
      return author;
    },
    { author: "", likes: 0 }
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
