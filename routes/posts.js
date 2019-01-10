'use strict';

const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');
const formMiddleware = require('../middleware/formMiddleware');

const ObjectId = require('mongoose').Types.ObjectId;

// add imgage, description and comment to the history
router.post('/create', authMiddleware.requireUser, formMiddleware.requireFieldsPost, (req, res, next) => {
  const { title, description, comment, imageUrl } = req.body;

  Post.create({
    title,
    description,
    comment,
    imageUrl,
    owner: req.session.currentUser._id
  }).then(result => {
    User.findByIdAndUpdate(req.session.currentUser._id, { $push: { history: title } })
      .then(() => {
        res.redirect('/');
      })
      .catch(next);
  }).catch(next);
});

// display post page
router.get('/:postId', authMiddleware.requireUser, (req, res, next) => {
  const postId = req.params.postId;
  if (!ObjectId.isValid(postId)) {
    return next();
  }
  Post.findById(postId)
    .then((result) => {
      // check if current user is an owner of a post
      const isOwner = (result.owner.equals(req.session.currentUser._id));
      res.render('posts/post', { post: result, isOwner });
    })
    .catch(next);
});
// remove the post
router.post('/:postId/remove', authMiddleware.requireUser, (req, res, next) => {
  const postId = req.params.postId;
  if (!ObjectId.isValid(postId)) {
    return next();
  }
  Post.findById(postId)
    .then((result) => {
      // check if owner
      if (!result.owner.equals(req.session.currentUser._id)) {
        return res.redirect('/');
      }
      Post.findByIdAndRemove(postId)
        .then((result) => {
          res.redirect('/');
        })
        .catch(next);
    })
    .catch(next);
});
// get an edit page
router.get('/:postId/edit', authMiddleware.requireUser, (req, res, next) => {
  const postId = req.params.postId;
  if (!ObjectId.isValid(postId)) {
    return next();
  }
  Post.findById(postId)
    .then((result) => {
      if (!result.owner.equals(req.session.currentUser._id)) {
        return res.redirect('/');
      }
      res.render('posts/edit', { post: result });
    })
    .catch(next);
});

// edit a comment
router.post('/:postId/edit', authMiddleware.requireUser, (req, res, next) => {
  const postId = req.params.postId;
  const { comment } = req.body;
  if (!ObjectId.isValid(postId)) {
    return next();
  }
  Post.findById(postId)
    .then((result) => {
      if (!result.owner.equals(req.session.currentUser._id)) {
        return res.redirect('/');
      }
      Post.findByIdAndUpdate(postId, { $set: { comment } })
        .then((result) => {
          res.redirect('/');
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
