const UserInfo = require('../models/userInfo');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

exports.createUserInfo = (req, res) => {
  UserInfo.createUserInfo(req.body, (err, userInfo) => {
    if(err) return res.sendStatus(500);
    return res.json(userInfo.ops[0]);
  })
}

exports.getAllUserInfo = (req, res) => {
  UserInfo.getAllUserInfo((err, usersInfo) => {
    if(usersInfo) {
      delete usersInfo._id;
    };
    if(err) {
      return res.sendStatus(500)
    };
    return res.json(usersInfo);
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
    return res.json(doc);
  })
}

exports.requestCoachPermission = (req, res) => {
  const id = req.params.id,
  phone = req.body.phone;
  UserInfo.requestCoachPermission(id, phone, (err, user) => {
    if(err) {
      return res.sendStatus(500)
    };
    return res.send(null);
  })
}

exports.acceptCoachPermission = (req, res) => {
  const token = req.params.token;
  console.log(token);
  UserInfo.acceptCoachRequest(token, (err, user) => {
    if(err) {
      return res.sendStatus(500)
    };
    return res.send(user);
  })
}