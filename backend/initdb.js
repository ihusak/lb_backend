const Roles = require('../backend/models/schemas/rolesSchema');
const Groups = require('./models/schemas/coursesSchema');

exports.init = () => {
  initRoles();
  initGroups();
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
    const initCourses = new Groups({
      name: group,
      forAll: true,
      coachId: ''
    });
    initCourses.save();
    return course;
  })
}