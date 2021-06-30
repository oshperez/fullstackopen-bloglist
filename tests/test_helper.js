const Blog = require("../models/blog");

initialBlogs = [
  {
    title: "iaculis congue vivamus metus arcu adipiscing molestie hendrerit",
    author: "Channa Rodgman",
    url: "http://wired.com/viverra.jpg",
    likes: 99780
  },
  {
    title: "ut odio cras mi pede",
    author: "Vincenz Alenichicov",
    url: "http://squarespace.com/odio/curabitur/convallis/duis/consequat.jpg",
    likes: 33053
  },
  {
    title: "quis lectus suspendisse",
    author: "Rusty Baford",
    url: "https://answers.com/aliquet/at/feugiat/non/pretium/quis/lectus.png",
    likes: 60532
  },
  {
    title: "diam neque vestibulum eget",
    author: "Windham Donwell",
    url: "http://dailymotion.com/cubilia/curae/nulla.xml",
    likes: 98463
  },
  {
    title: "augue vel accumsan",
    author: "Linette Dodgson",
    url: "http://weather.com/erat/tortor/sollicitudin.jpg",
    likes: 89881
  },
  {
    title: "adipiscing molestie hendrerit at vulputate vitae nisl aenean lectus",
    author: "Annmaria Noddings",
    url: "http://ft.com/a/pede/posuere/nonummy/integer.js",
    likes: 23557
  },
  {
    title: "integer pede justo lacinia eget tincidunt eget tempus",
    author: "Bernadina Narramor",
    url: "http://usnews.com/convallis/nunc/proin/at/turpis/a/pede.html",
    likes: 49905
  },
  {
    title: "quisque arcu libero rutrum ac lobortis",
    author: "Janos Chetter",
    url: "https://shinystat.com/nulla/nunc/purus/phasellus/in/felis/donec.jpg",
    likes: 60236
  },
  {
    title: "donec vitae nisi nam ultrices libero non mattis",
    author: "Ermengarde Sturge",
    url: "http://slashdot.org/fusce/congue/diam/id/ornare/imperdiet/sapien.xml",
    likes: 31086
  },
  {
    title: "ut tellus nulla ut erat",
    author: "Birgit Dreossi",
    url: "https://aboutads.info/cum.js",
    likes: 34591
  },
  {
    title: "semper sapien a libero nam dui proin",
    author: "Hettie Ambresin",
    url: "https://cnn.com/turpis/enim/blandit/mi/in/porttitor.aspx",
    likes: 2887
  },
  {
    title: "nulla elit ac nulla sed vel enim sit amet",
    author: "Huntlee O' Donohue",
    url: "http://yellowpages.com/curae/nulla/dapibus/dolor.html",
    likes: 60058
  },
  {
    title: "nec nisi vulputate nonummy maecenas tincidunt lacus at velit",
    author: "Evvie Lorentzen",
    url: "https://xrea.com/porttitor/lorem/id.png",
    likes: 27961
  },
  {
    title: "mattis egestas metus aenean fermentum donec",
    author: "Valentino Gulk",
    url: "http://dedecms.com/neque.jsp",
    likes: 11277
  },
  {
    title: "curabitur gravida nisi at nibh in hac habitasse platea dictumst",
    author: "Dix Woofenden",
    url: "https://unesco.org/massa/tempor/convallis/nulla/neque/libero/convallis.js",
    likes: 62654
  },
  {
    title: "lorem ipsum dolor sit amet consectetuer adipiscing",
    author: "Uriel Oliveras",
    url: "http://phpbb.com/justo/in.xml",
    likes: 88273
  },
  {
    title: "condimentum curabitur in libero",
    author: "Kippy Krink",
    url: "https://pbs.org/eu/interdum/eu/tincidunt.jsp",
    likes: 46678
  },
  {
    title: "vivamus metus arcu adipiscing molestie",
    author: "Alleen Adelman",
    url: "https://unblog.fr/habitasse/platea/dictumst/etiam/faucibus.aspx",
    likes: 76429
  },
  {
    title: "turpis donec posuere metus vitae ipsum aliquam non",
    author: "Brand Newborn",
    url: "https://yelp.com/non/sodales/sed/tincidunt.xml",
    likes: 59550
  },
  {
    title: "primis in faucibus orci luctus et ultrices posuere",
    author: "Olag Lehrian",
    url: "http://youku.com/cras/non/velit/nec/nisi/vulputate.xml",
    likes: 61409
  }
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
