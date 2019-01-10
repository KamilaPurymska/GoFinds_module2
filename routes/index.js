require('dotenv').config();

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const parser = require('../helpers/file-upload');

// get home page
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', authMiddleware.requireUser, parser.single('image'), (req, res, next) => {
  const requestBody = {
    requests: [{
      image: { source: { imageUri: req.file.url } },
      features: [{
        type: 'LANDMARK_DETECTION',
        maxResults: 100
      }]
    }]
  };

  axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
    requestBody
  )
    .then((response) => {
      // image not indentified
      if (Object.keys(response.data.responses[0]).length === 0) {
        return res.redirect('/not-identified');
      }
      let title = response.data.responses[0].landmarkAnnotations[0].description;
      const arrayTitle = title.split('');
      title = '';
      // take just the first part of the title
      for (let element of arrayTitle) {
        let breakForEach = false;
        switch (element) {
        case '(':
          breakForEach = true;
          break;
        case ',':
          breakForEach = true;
          break;
        default:
          title += element;
        }
        if (breakForEach) {
          break;
        }
      };
      // title to URL
      title = encodeURIComponent(title);
      res.redirect('/landmark_info?title=' + title + '&image=' + req.file.url);
    });
});

module.exports = router;
