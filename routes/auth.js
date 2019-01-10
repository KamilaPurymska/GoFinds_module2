'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');
const formMiddleware = require('../middleware/formMiddleware');

const bcrypt = require('bcrypt');
const saltRounds = 10;

// get signup page
router.get('/signup', authMiddleware.requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('error')
  };
  res.render('auth/signup', data);
});

// post for signup form
router.post('/signup', authMiddleware.requireAnon, formMiddleware.requireFieldsUser, (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (user) {
        // username already taken
        req.flash('error', 'Username is taken');
        return res.redirect('/auth/signup');
      }
      // password bcrypt
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      // create a user
      User.create({
        username,
        password: hashedPassword
      })
        .then((newUser) => {
          req.session.currentUser = newUser;
          res.redirect('/');
        });
    })
    .catch(next);
});
// get login page
router.get('/login', authMiddleware.requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('error')
  };
  res.render('auth/login', data);
});

// post login form
router.post('/login', authMiddleware.requireAnon, formMiddleware.requireFieldsUser, (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        // username has not been found
        req.flash('error', 'User not found');
        return res.redirect('/auth/login');
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        // password is incorrect
        req.flash('error', 'Username or password incorrent');
        res.redirect('/auth/login');
      }
    })
    .catch(next);
});

// post logout delete session
router.post('/logout', authMiddleware.requireUser, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
