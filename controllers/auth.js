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
  // LOGOUT
  app.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    return res.redirect('/');
  });
  // LOGIN FORM
  app.get('/login', (req, res) => res.render('auth-login'));
  // LOGIN
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Find this user name
    User.findOne({ username }, 'username password')
      .then((user) => {
        if (!user) {
          // User not found
          return res
            .status(401)
            .send({ message: 'Wrong Username or Password' });
        }
        // Check the password
        user.comparePassword(password, (err, isMatch) => {
          if (!isMatch) {
            // Password does not match
            return res
              .status(401)
              .send({ message: 'Wrong Username or password' });
          }
          // Create a token
          const token = jwt.sign(
            { _id: user._id, username: user.username },
            process.env.SECRET,
            {
              expiresIn: '60 days',
            }
          );
          // Set a cookie and redirect to root
          res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
          return res.redirect('/');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
