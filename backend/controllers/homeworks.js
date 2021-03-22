const Homework = require('../models/homework');
const Homeworks = require('../models/schemas/homeworksSchema');

exports.createHomework = (req, res) => {
  const HOMEWORK = new Homeworks({
    students: req.body.students,
    title: req.body.title,
    description: req.body.description,
    example: req.body.example,
    reward: req.body.reward,
    createdDate: new Date()
  });
  Homework.createHomework(HOMEWORK, (err, savedHomework) => {
    if(err) return res.sendStatus(500);
    return res.json(savedHomework);
  })
}
