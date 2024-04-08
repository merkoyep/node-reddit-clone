const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../server');

chai.use(chaiHttp);
const agent = chai.request.agent(app);

const should = chai.should();
const User = require('../models/user');

describe('User', function () {
  it('should not be able to login if they have not registered', function (done) {
    agent
      .post('/login', { username: 'wrong@example.com', password: 'nope' })
      .end(function (err, res) {
        res.should.have.status(401);
        done();
      });
  });
  it('should be able to signup', async function () {
    // First, try to remove any existing user
    await User.findOneAndDelete({ username: 'testone' });

    // Then, attempt to sign up a new user
    const res = await agent
      .post('/sign-up')
      .send({ username: 'testone', password: 'password' });

    // Assertions
    res.should.have.status(200);
    agent.should.have.cookie('nToken');
  });
  // login
  it('should be able to login', function (done) {
    agent
      .post('/login')
      .send({ username: 'testone', password: 'password' })
      .end(function (err, res) {
        res.should.have.status(200);
        agent.should.have.cookie('nToken');
        done();
      });
  });
  // logout
  it('should be able to logout', function (done) {
    agent.get('/logout').end(function (err, res) {
      res.should.have.status(200);
      agent.should.not.have.cookie('nToken');
      done();
    });
  });
  after(function () {
    agent.close();
  });
});
