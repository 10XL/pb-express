var express = require('express');
var postRouter = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var verify = require('../verify');

var Posts = require('../models/post');

postRouter.use(bodyParser.json());

/* GET posts listing. */
// should make a call to the database and retreive latest 10 public posts(on sidebar)
postRouter.get('/', function(req, res, next) {
  Posts.find({
      public: true
    })
    .limit(10)
    .sort([
      ['createdAt', 'descending']
    ])
    .exec(function(err, posts) {
      if (err) next(err);
      res.json(posts);
    });
});

// if logged in set author to user id
postRouter.post('/', verify.verifyLoggedIn, function(req, res, next) {
  var options = req.body;
  if (req.decoded) options.author = req.decoded._doc._id;
  Posts.create(options, function(err, post) {
    if (err) return next(err);
    console.log('Post created!');
    var id = post._id;
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify({
      status: 'Added the post with id: ' + id,
      post: post
    }));
  });
});

// should make a call to the database and retreive latest 50 public posts
postRouter.get('/latest', function(req, res, next) {
  Posts.find({
      public: true
    })
    .limit(50)
    .sort([
      ['createdAt', 'descending']
    ])
    .exec(function(err, posts) {
      if (err) next(err);
      res.json(posts);
    });
});

// show logged in users their posts
postRouter.get('/mine', verify.verifyOrdinaryUser, function(req, res, next) {
  Posts.find({
      author: req.decoded._doc._id
    })
    .sort([
      ['createdAt', 'descending']
    ])
    .exec(function(err, posts) {
      if (err) return next(err);
      res.json(posts);
    });
});

// show individual post
postRouter.get('/:postId', function(req, res, next) {
  Posts.findByIdAndUpdate(req.params.postId, {
      $inc: {
        views: 1
      }
    })
    .exec(function(err, post) {
      if (err) return next(err);
      res.json(post);
    });
});


module.exports = postRouter;