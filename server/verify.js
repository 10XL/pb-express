var User = require('./models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.js');

exports.getToken = function(user) {
  return jwt.sign(user, config.jwtSecret, {
    expiresIn: 604800
  });
};

// create function to only check if logged in without restricting access
exports.verifyLoggedIn = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.jwtSecret, function(err, decoded) {
      if (err) {
        return next();
      } else {
        req.decoded = decoded;
        return next();
      }
    });

  } else // no token so go along with the post
    return next();
};

exports.verifyOrdinaryUser = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.jwtSecret, function(err, decoded) {
      if (err) {
        var overrideErr = new Error('You are not authenticated!');
        overrideErr.status = 401;
        return next(overrideErr);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        return next();
      }
    });
  } else {
    // if there is no token
    // return an error
    var err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
};

exports.verifyAdmin = function(req, res, next) {
  var isAdmin = req.decoded._doc.admin;
  if (isAdmin) {
    next();
  } else {
    var err = new Error('You are not authorizd to perform this operation!');
    err.status = 403;
    return next(err);
  }
};