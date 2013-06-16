'use strict';

var crypto = require('crypto')
  , db = require('./db')
  , http = require('http')
  , ObjectID = require('mongodb').ObjectID;

module.exports = {
  authenticate: function(username, password, callback) {
    db.findOne('users', {username: username}, function(err, user) {
      if (user && (user.password === encryptPassword(password)))
        callback(err, user._id);
      else
        callback(err, null);
    });
  },
      
  createUser: function(username, email, password, callback) {
    var user = {username: username, email: email, password: encryptPassword(password)};
    db.insertOne('users', user, callback);
  },
  
  ensureAuthenticated: function (req, res, next) {
    if (req.session._id) {
      return next();
    }
    res.redirect('/loginPage');
  },

  getUserById: function(id, callback) {
    db.findOne('users', {_id: new ObjectID(id)}, callback);
  },

  getUser: function(username, callback) {
    db.findOne('users', {username: username}, callback);
  }
}

function encryptPassword(plainText) {
  return crypto.createHash('md5').update(plainText).digest('hex');
}