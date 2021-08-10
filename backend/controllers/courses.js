const Course = require('../models/course');

exports.getCourses = (req, res) => {
  Course.all((err, courses) => {
    if(err) return res.sendStatus(500);
    return res.json(courses);
  });
}

exports.getCourseByCoachId = (req, res) => {
  const id = req.params.coachId;
  Course.getCourseByCoachId(id, (err, courses) => {
    if(err) return res.sendStatus(500);
    return res.json(courses);
  });
}

exports.createCourse = (req, res) => {
  Course.createCourse(req, (err, course) => {
    if(err) return res.sendStatus(500);
    return res.json(course);
  });
}
exports.updateCourse = (req, res) => {
  const courseId = req.params.courseId;
  const course = req.body.course;
  Course.updateCourse(courseId, course, (err, updatedCourse) => {
    if(err) return res.sendStatus(500);
    return res.json(updatedCourse);
  })
}
