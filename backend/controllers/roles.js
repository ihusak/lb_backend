const Roles = require('../models/roles');

exports.getRoles = (req, res) => {
  Roles.all((err, roles) => {
    if(err) return res.sendStatus(500);
    return res.json(roles);
  })
}