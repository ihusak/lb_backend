const db = require('../config/db');
const { ObjectID } = require('mongodb');
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

exports.getCourseByCoachId = (id, cb) => {
  db.get().collection('courses').find({coachId: id}).toArray((err, courses) => {
    const mappedCourses = courses.map(course => {
      course.id = course._id;
      delete course._id;
      return course;
    });
    cb(err, mappedCourses);
  })
}

exports.createCourse = (req, cb) => {
  const COURSE = new Course({
    coachId: req.body.coachId,
    description: {
      text: req.body.description.text,
      video: req.body.description.video
    },
    forAll: req.body.forAll,
    name: req.body.name,
    price: req.body.price
  });
  db.get().collection('courses').insertOne(COURSE, (err, doc) => {
    cb(err, doc.ops[0]);
  })
}

exports.updateCourse = (courseId, course, cb) => {
  db.get().collection('courses').findOneAndUpdate({'_id': new ObjectID(courseId)}, {$set: course}, (err, updatedCourse) => {
    updatedCourse.value.id = updatedCourse.value._id;
    delete updatedCourse.value._id;
    cb(err, updatedCourse.value);
  })
}
