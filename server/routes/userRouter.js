var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var verify = require('../verify');

var User = require('../models/user.js');
var Post = require('../models/post.js');

router.all('/*', function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "http://localhost:3000");
  response.header("Access-Control-Allow-Headers", 'Content-Type, x-access-token');
  response.header("Access-Control-Allow-Methods", "GET, POST", "PUT", "DELETE");
  next();
});

router.get('/', verify.verifyOrdinaryUser, function(req, res, next) { // change to only for admin users
  User.find({}, function(err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

router.get('/:username/', function(req, res, next) { // find public posts authored by :username
  User.findOne({
    username: req.params.username
  }, function(err, user) {
    if (err) return next(err);
    res.json(user);
  });
});

router.get('/:username/posts', function(req, res, next) { // find public posts authored by :username
  User.findOne({
    username: req.params.username
  }, function(err, user) {
    if (err || user === null) return next(err);
    Post.find({
        public: true,
        author: user._id
      })
      .limit(25)
      .sort([
        ['createdAt', 'descending']
      ])
      .exec(function(err, posts) {
        if (err) next(err);
        res.json(posts);
      });
  });

});


router.post('/register', function(req, res) {
  User.register(new User({
      username: req.body.username
    }),
    req.body.password,
    function(err, account) {
      if (err) return res.status(500).json({
        err: err
      });
      passport.authenticate('local')(req, res, function() {
        return res.status(200).json({
          status: 'Registration successful!'
        });
      });
    });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      var token = verify.getToken(user);
      res.status(200).json({
        status: `Login successful! Welcome, ${user.username}`,
        success: true,
        token: token
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  res.status(200).json({
    status: 'Bye!'
  });
});

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = router;