/* Mongoose Connection */
const mongoose = require('mongoose');
assert = require('assert');

const url = 'mongodb://localhost/reddit-db';
mongoose
  .connect(url, {
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected successfully to database'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection Error:')
);
mongoose.set('debug', true);

module.exports = mongoose.connection;
