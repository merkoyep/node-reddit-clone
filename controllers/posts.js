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
};
