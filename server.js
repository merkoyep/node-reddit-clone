const express = require('express');
const app = express();
const Post = require('./models/post');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
// Set db
require('./data/reddit-db');
// Use "main" as our default layout
app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
// Use handlebars to render
app.set('view engine', 'handlebars');

app.get('/', async (req, res) => {
  try {
    const posts = await Post.find({}).lean();
    return res.render('posts-index', { posts });
  } catch (err) {
    console.log(err.message);
  }
});
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Controllers
require('./controllers/posts')(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('App listening on port 3000!');
});
