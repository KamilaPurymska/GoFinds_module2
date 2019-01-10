'use strict';

const express = require('express');
const router = express.Router();

// get not identified page
router.get('/', (req, res, next) => {
  res.render('not-identified');
});

module.exports = router;
