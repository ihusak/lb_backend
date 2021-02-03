const db = require('../config/db');
const Course = require('./schemas/coursesSchema');

exports.all = (cb) => {
  db.get().collection('courses').find({}).toArray((err, courses) => {
    const coursesMapped = courses.map(course => {
      course.id = course._id;
      delete course._id;
      delete course.__v;
      return course
    })
    cb(err, coursesMapped);
  })
};

exports.createCourse = (req, cb) => {
  console.log(req.body, req.user);
  const group = new Course({
    name: req.body.courseName,
    forAll: req.body.forAll,
    coachId: req.body.coachId,
    price: req.body.price
  });
  db.get().collection('courses').insertOne(group, (err, doc) => {
    cb(err, doc.ops[0]);
  })
}
