var express = require('express');
var router = express.Router();
var mid = require('../middleware');
var User = require('../models/users');
var Token = require('../models/token');
var Journey = require('../models/journey');
const mongoose = require('mongoose');
const methodOverride = require("method-override");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Welcome' });
});

/* GET home page. */
router.get('/bookATicket', function (req, res, next) {
  res.render('bookATicket', { title: 'Book A Ticket' });
});

/* GET home page. */
router.get('/myTrips', function (req, res, next) {
  res.render('myTrips', { title: 'Your Trips' });
});

/* GET home page. */
router.get('/process', function (req, res, next) {
  res.render('process', { title: 'Book A Ticket' });
});

/* GET home page. */
router.get('/confirm', function (req, res, next) {
  res.render('confirm', { title: 'Book A Ticket' });
});

/* GET home page. */
router.get('/guest', function (req, res, next) {
  res.render('guest', { title: 'Guest Home' });
});

/* GET home page. */
router.get('/topUp', function (req, res, next) {
  res.render('topUp', { title: 'Guest Home' });
});


/*Book*/
router.get('/book', function (req, res, next) {
  res.render('book');
});

// GET /login
router.get('/login', mid.loggedOut, function (req, res, next) {
  return res.render('login', { title: 'Log In' });
});

// POST /login
router.post('/login', function (req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        req.session.userName = user.userName;
        return res.redirect('../profile');
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

// GET /logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET /profile
router.get('/profile', mid.requiresLogin, function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.render('profile', { title: 'Profile', name: user.userName, email: user.email, firstName: user.firstName, jobTitle: user.jobTitle });
      }
    });
});


module.exports = router;
