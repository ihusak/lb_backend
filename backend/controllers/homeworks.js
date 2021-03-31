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
  });
}

exports.deleteHomework = (req, res) => {
  const homeworkId = req.body.homeworkId;
  Homework.deleteHomework(homeworkId, (err, hm) => {
    if(err) return res.sendStatus(500);
    return res.json({result: 'ok', status: 'deleted'});
  })
}

exports.getHomeworkById = (req, res) => {
  const homeworkId = req.params.homeworkId;
  Homework.getHomeworkById(homeworkId, (err, hm) => {
    if(err) return res.sendStatus(500);
    return res.json(hm);
  })
}

exports.getAllHomeworks = (req, res) => {
  Homework.getAllHomeworks((err, homeworks) => {
    if(err) return res.sendStatus(500);
    return res.json(homeworks);
  });
}

exports.like = (req, res) => {
  const userId = req.body.userId;
  const homeworkId = req.body.homeworkId;
  Homework.likeHomework(userId, homeworkId, (err, hm) => {
    if(err) return res.sendStatus(500);
    return res.json(hm);
  });
}
