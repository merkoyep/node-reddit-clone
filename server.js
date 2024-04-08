const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require('dotenv').config();
const Post = require('./models/post');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const checkAuth = require('./middleware/checkAuth');
app.use(cookieParser());
app.use(checkAuth);
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

app.get('/', (req, res) => {
  const { user } = req;
  console.log(req.cookies);
  Post.find({})
    .lean()
    .populate('author')
    .then((posts) => res.render('posts-index', { posts, user }))
    .catch((err) => {
      console.log(err.message);
    });
});
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Controllers
require('./controllers/posts')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('App listening on port 3000!');
});

module.exports = app;
