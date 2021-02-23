const Course = require('../models/course');

exports.getCourses = (req, res) => {
  Course.all((err, courses) => {
    if(err) return res.sendStatus(500);
    return res.json(courses);
  })
}

exports.createCourse = (req, res) => {
  Course.createCourse(req, (err, course) => {
    console.log(course);
    if(err) return res.sendStatus(500);
    return res.json(course);
  })
}
