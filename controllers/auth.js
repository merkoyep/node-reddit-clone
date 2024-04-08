const jwt = require('jsonwebtoken');
const User = require('../models/user');
module.exports = (app) => {
  // SIGN UP FORM
  app.get('/sign-up', (req, res) => res.render('auth-signup'));
  app.post('/sign-up', (req, res) => {
    // Create User
    const user = new User(req.body);

    user.save().then(() => {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
        expiresIn: '60 days',
      });
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
      return res.redirect('/');
    });
  });
};
