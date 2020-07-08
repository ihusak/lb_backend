const UserInfo = require('../models/userInfo');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

exports.createUserInfo = (req, res) => {
  UserInfo.createUserInfo(req.body, (err, userInfo) => {
    if(err) return res.sendStatus(500);
    return res.json(userInfo.ops[0]);
  })
}

exports.getUserInfo = (req, res) => {
  let id = req.params.id;
  UserInfo.getUserInfo(id, (err, doc) => {
    if(doc) {
      delete doc._id;
    };
    if(err) {
      return res.sendStatus(500)
    };
    return res.json(doc);
  })
}

exports.updateUserInfo = (req, res) => {
  let id = req.params.id;
  const userInfo = req.body.userInfo;
  UserInfo.updateUserInfo(id, userInfo, req.file, (err, doc) => {
    if(err) {
      return res.sendStatus(500)
    };
    return res.json(userInfo);
  })
}