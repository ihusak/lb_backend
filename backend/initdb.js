const Roles = require('../backend/models/schemas/rolesSchema');
const Courses = require('./models/schemas/coursesSchema');

exports.init = () => {
  initRoles();
  initCourses();
}

initRoles = () => {
  const arrayRoles = ['ADMIN', 'STUDENT', 'PARENT', 'COACH'];
  arrayRoles.map((role, index) => {
    const initRoles = new Roles({
      name: role,
      id: index + 1,
      status: role === 'COACH' ? false : true
    });
    initRoles.save();
    return role;
  })
}

initCourses = () => {
  const arrayCourses = ['BEGINNER', 'MIDDLE', 'MASTER'];
  arrayCourses.map((course, index) => {
    const initCourses = new Courses({
      name: course,
      forAll: true,
      coachId: ''
    });
    initCourses.save();
    return course;
  })
}