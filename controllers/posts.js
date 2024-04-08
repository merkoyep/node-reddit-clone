const Post = require('../models/post');

module.exports = (app) => {
  app.get('/posts/new', async (req, res) => {
    res.render('posts-new');
  });
  app.post('/posts/new', async (req, res) => {
    console.log('Received form data:', req.body);
    try {
      const post = new Post(req.body);
      await post.save();
      res.redirect('/');
    } catch (err) {
      console.error('Error saving the post:', err);
      res.status(500).send('Error saving the post.');
    }
  });

  app.get('/posts/:id', (req, res) => {
    Post.findById(req.params.id)
      .lean()
      .then((post) => res.render('posts-show', { post }))
      .catch((err) => {
        console.log(err.message);
      });
  });
  // SUBREDDIT
  app.get('/n/:subreddit', (req, res) => {
    Post.find({ subreddit: req.params.subreddit })
      .lean()
      .then((posts) => res.render('posts-index', { posts }))
      .catch((err) => {
        console.log(err);
      });
  });
};
