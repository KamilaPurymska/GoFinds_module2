'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  comment: {
    type: String
  },
  imageUrl: {
    type: String,
    required: true
  },
  owner: {
    // type: String
    type: ObjectId,
    ref: 'User'
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
