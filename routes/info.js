'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');

const rp = require('request-promise');

// GET description page - Wikipedia API
router.get('', (req, res, next) => {
  const imageUrl = req.query.image;
  const title = req.query.title;
  let wikiTitle;
  let content;

  const options1 = {
    method: 'GET',
    uri: 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + title,
    json: true
  };
  rp(options1)
    .then((result) => {
      wikiTitle = result[1][0];
      getContent();
    })
    .catch();

  const getContent = () => {
    const options2 = {
      method: 'GET',
      uri: 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=' + wikiTitle,
      json: true
    };
    rp(options2)
      .then((result) => {
        // wikipedia API shit
        const page = result.query.pages;
        const pageId = Object.keys(page)[0];
        content = page[pageId].extract;
        const landmark = title;
        let placesAndScores = {};
        let orderedList = [];
        // recommendations
        User.find()
          .then(arrayOfUsers => {
            arrayOfUsers.forEach(user => {
              let hasVisited = false;
              user.history.forEach(place => {
                if (place === landmark) {
                  hasVisited = true;
                }
              });
              if (hasVisited) {
                user.history.forEach(place => {
                  if ([place] in placesAndScores) {
                    placesAndScores[place]++;
                  } else {
                    placesAndScores[place] = 1;
                  }
                });
              }
            });
            // sort places and display the 3 most popular
            placesAndScores[landmark] = 0;
            const sortable = [];
            for (let place in placesAndScores) {
              sortable.push([place, placesAndScores[place]]);
            }
            sortable.sort((a, b) => {
              return b[1] - a[1];
            });
            if (sortable.length > 3) {
              orderedList = [sortable[0][0], sortable[1][0], sortable[2][0]];
            }
            res.render('display-info', { title, content, imageUrl, orderedList });
          })
          .catch();
      })
      .catch();
  };
});

module.exports = router;
