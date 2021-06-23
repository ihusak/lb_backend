const userRoles = require('../enum/roles');
module.exports = Object.freeze({
  [userRoles.STUDENT]: ['all', 'homeworks'],
  [userRoles.ADMIN]: ['all', 'homeworks'],
  [userRoles.PARENT]: ['all', 'homeworks'],
  [userRoles.COACH]: ['all', 'homeworks']
});
