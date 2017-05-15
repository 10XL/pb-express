var express = require('express');
var postRouter = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var verify = require('../verify');

var Post = require('../models/post');

postRouter.use(bodyParser.json());

/* GET posts listing. */
// should make a call to the database and retreive latest 10 public posts(on sidebar)
postRouter.all('/*', function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "http://localhost:3000");
  response.header("Access-Control-Allow-Headers", 'Content-Type, x-access-token');
  response.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  next();
});


postRouter.get('/', function(req, res, next) {
  Post.find({
      public: true
    })
    .populate("author")
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
  Post.create(options, function(err, post) {
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
  Post.find({
      public: true
    })
    .populate("author")
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
  Post.find({
      author: req.decoded._doc._id
    })
    .sort([
      ['createdAt', 'descending']
    ])
    .exec(function(err, posts) {
      if (err) next(err);
      res.json(posts);
    });
});

// show individual post
postRouter.get('/:postId', function(req, res, next) {
  Post.findByIdAndUpdate(req.params.postId, {
      $inc: {
        views: 1
      }
    })
    .populate("author")
    .exec(function(err, post) {
      if (err || post===null) return next(err);
      res.json(post);
    });
});

postRouter.delete('/:postId', verify.verifyLoggedIn, function(req, res, next) {
  if (!req.decoded) return next(new Error('Unauthorized'));
  Post.findOne({
      _id: req.params.postId,
      author: req.decoded._doc._id
    })
    .remove()
    .exec(function(err, removed) {
      if (err) return next(err);
      if (removed.result.n < 1) return next(new Error(500));
      res.end('Success, deleted post with id ' + req.params.postId);
    });
});


module.exports = postRouter;