const db = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const userInfoSchema = require('./schemas/userInfoSchema');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'afreestylers2016@gmail.com',
    pass: 'afreestylers2016'
  }
})

exports.acceptUserTask = (userId, task, cb) => {
  console.log(userId, task);
  // db.get().collection('userInfo').findOneAndUpdate(userId, {$set: {

  // }}, {returnOriginal: false}, (err, doc) => {
  //   cb(err, doc.value);
  // })
}

exports.createUserInfo = (body, cb) => {
  const userInfo = new userInfoSchema({
    id: body._id,
    email: body.email,
    userName: body.userName,
    role: body.role
  });
  db.get().collection('userInfo').insertOne(userInfo, (err, doc) => {
    if(cb) {
      cb(err, doc)
    };
  })
};

exports.getUserInfo = (id, cb) => {
  let userId = {'id': id};
  db.get().collection('userInfo').findOne(userId, (err, doc) => {
    cb(err, doc);
  })
}

exports.getAllUserInfo = (cb) => {
  db.get().collection('userInfo').find({}).toArray((err, usersInfo) => {
    cb(err, usersInfo);
  })
}

exports.getUserInfoByCoach = (coachId, cb) => {
  db.get().collection('userInfo').find({'coach.id': coachId}).toArray((err, usersInfo) => {
    cb(err, usersInfo);
  })
}

exports.updateUserInfo = (id, userInfo, file, cb) => {
  let userId = {'id': id};
  let userInfoBody = JSON.parse(userInfo);
  if(file) userInfoBody.userImg = file.path;
  let userInfoReq = { $set: userInfoBody };
  db.get().collection('userInfo').findOneAndUpdate(userId, userInfoReq, {returnOriginal: false}, (err, doc) => {
    cb(err, doc.value);
  })
}

exports.changeTaskStatus = (task, id, cb) => {
  let userId = {'id': id};
  db.get().collection('userInfo').findOneAndUpdate(userId, {$set: { 'currentTask' : task  }}, {returnOriginal: false}, (err, doc) => {
    cb(err, doc.value);
  })
}


exports.requestCoachPermission = (id, phone, cb) => {
  let userId = {'id': id};
  db.get().collection('userInfo').findOne(userId, (err, foundUser) => {
    sendRequestCoachPermission(foundUser, phone);
    cb(err, foundUser);
  })
}

exports.acceptCoachRequest = (token, cb) => {
  const {id} = jwt.verify(token, config.emailSercet);
  if(id) {
    db.get().collection('userInfo').updateOne({'id': id},{ $set: { 'role.status' : true  } }, (err, foundUser) => {
      cb(err, foundUser);
    })
  }
}

sendRequestCoachPermission = (user, phone) => {
  const originUrl = process.env.MONGODB_URI || config.local_dev;
  const userPhone = user.phone ? user.phone : phone;
  const emailToken = jwt.sign(
    {
      id: user.id
    },
    config.emailSercet,
    {
      expiresIn: '1d'
    }
  );
  const url = `${originUrl}/userInfo/confirm/coach/${emailToken}`;
  const mailOptions = {
    from: user.email, // sender address
    to: 'ilyagusak@gmail.com', // list of receivers
    subject: 'Request Coach Permission #LB', // Subject line
    html: `<h1>${user.userName} want's to be a coach</h1>
    <p>Please contact him to confirm coach permission: <b>${userPhone}</b></p>
    <p>if everything fine click <a href='${url}'>Confirm coach request</a></p>
    `// plain text body
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if(err)
      console.log(err)
    else
      console.log(info);
 });
}