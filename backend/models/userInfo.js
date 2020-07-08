const db = require('../config/db');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const userInfoSchema = require('./schemas/userInfoSchema');
const ObjectID = mongoose.Types.ObjectId;

exports.createUserInfo = (body, cb) => {
  const userInfo = new userInfoSchema({
    id: body.id,
    email: body.email,
    userName: body.userName,
  });
  db.get().collection('userInfo').insertOne(userInfo, (err, doc) => {
    cb(err, doc);
  })
};

exports.getUserInfo = (id, cb) => {
  let userId = {'id': id};
  db.get().collection('userInfo').findOne(userId, (err, doc) => {
    cb(err, doc);
  })
}

exports.updateUserInfo = (id, userInfo, file, cb) => {
  let userId = {'id': id};
  let userInfoBody = JSON.parse(userInfo);
  if(file) userInfoBody.userImg = file.path;
  let userInfoReq = { $set: userInfoBody };
  db.get().collection('userInfo').updateOne(userId, userInfoReq, (err, doc) => {
    cb(err, doc);
  })
}
