const Roles = require('../backend/models/schemas/rolesSchema');
const Groups = require('../backend/models/schemas/groupsSchema');

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

initGroups = () => {
  const arrayGroups = ['BEGINNER', 'MIDDLE', 'MASTER'];
  arrayGroups.map((group, index) => {
    const initGroups = new Groups({
      name: group
    });
    initGroups.save();
    return group;
  })
}