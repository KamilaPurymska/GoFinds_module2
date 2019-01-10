'use strict';

const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

const formMiddleware = require('../middleware/formMiddleware');

cloudinary.config({
  cloud_name: 'gofinds',
  api_key: 615415761933833,
  api_secret: 'ClmKSMTduF6xUrKqVUayMl0BdN8'
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'demo',
  allowedFormats: ['jpg', 'png']
});

const parser = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      req.fileValidationError = true;
      return cb(null, false, new Error('Wrong file type uploaded'));
    }
    cb(null, true);
  }
});

module.exports = parser
;
