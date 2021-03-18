const Homework = require('../models/homework');

exports.createHomework = (req, res) => {
  Homework.createHomework((err, hm) => {
    if(err) return res.sendStatus(500);
    return res.json(hm);
  })
}
