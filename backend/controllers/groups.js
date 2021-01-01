const Group = require('../models/group');

exports.getGroups = (req, res) => {
  Group.all((err, groups) => {
    if(err) return res.sendStatus(500);
    return res.json(groups);
  })
}

exports.createGroup = (req, res) => {
  Group.createGroup(req, (err, group) => {
    if(err) return res.sendStatus(500);
    return res.json(group);
  })
}