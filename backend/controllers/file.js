const File = require('../models/files');

exports.uploadAvatar = (req, res) => {
  File.uploadAvatar(req.file, (err, file) => {
    if(err) return res.sendStatus(500);
    return res.json(file);
  })
}