const File = require('../models/files');

exports.uploadAvatar = (req, res) => {
  console.log('FILE Req', req.file);
  File.uploadAvatar(req.file, (err, file) => {
    if(err) return res.sendStatus(500);
    console.log('return file');
    return res.json(file);
  })
}