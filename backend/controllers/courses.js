const Course = require('../models/course');

exports.getCourses = (req, res) => {
  Course.all((err, courses) => {
    if(err) return res.sendStatus(500);
    return res.json(courses);
  });
}

exports.getCourseByCoachId = (req, res) => {
  const id = req.params.coachId;
  console.log(id);
  Course.getCourseByCoachId(id, (err, course) => {
    if(err) return res.sendStatus(500);
    return res.json(course);
  });
}

exports.createCourse = (req, res) => {
  Course.createCourse(req, (err, course) => {
    if(err) return res.sendStatus(500);
    return res.json(course);
  });
}
