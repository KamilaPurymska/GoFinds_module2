'use strict';

const formMiddleware = {};

formMiddleware.requireFieldsUser = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    // username and password fields can't be empty
    req.flash('error', `fields can't be empty`);
    return res.redirect(`/auth${req.path}`);
  }
  next();
};

formMiddleware.requireFieldsPost = (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    // username and password fields can't be empty
    req.flash('error', `fields can't be empty`);
    return res.redirect(`/post${req.path}`);
  }
  next();
};

module.exports = formMiddleware;
