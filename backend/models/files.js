const db = require('../config/db');
const File = require('../models/schemas/fileSchema')

exports.uploadAvatar = (file, cb) => {
  const _file = new File({
    image: file.filename,
    userId: ""
  });
  db.get().collection('userImage').insertOne(_file, (err, doc) => {
    cb(err, doc);
  });
};