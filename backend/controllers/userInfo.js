const UserInfo = require('../models/userInfo');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;
const {userTasksLogger} = require('../config/middleware/logger');

const TaskStatuses = {
  PROCESSING: 'Processing',
  PENDING: 'Pending',
  DONE: "Done"
}

exports.acceptUserTask = (req, res) => {
  const userId = req.params.userId;
  const task = req.body.task;
  UserInfo.acceptUserTask(userId, task, (err, userInfo) => {
    if(err) return res.sendStatus(500);
    return res.json(userInfo);
  })
}

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

exports.getUserInfoByCoach = (req, res) => {
  const coachId = req.params.coachId;
  UserInfo.getUserInfoByCoach(coachId, (err, usersInfo) => {
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

exports.changeTaskStatus = (req, res) => {
  let id = req.params.id;
  let task = req.body.task;
  UserInfo.changeTaskStatus(task, id, (err, userInfo) => {
    if(err) {
      return res.sendStatus(500)
    };
    switch(task.status) {
      case TaskStatuses.PROCESSING: 
      userLoggerTasks(`User assign task and start work`, task, id);
      break;
      case TaskStatuses.PENDING: 
      userLoggerTasks(`User pass task and waiting for result`, task, id);
      break;
      case TaskStatuses.DONE: 
      userLoggerTasks(`User done task and start work for another`, task, id);
      break;
    }
    return res.json(userInfo);
  })
}

exports.requestCoachPermission = (req, res) => {
  const id = req.params.id,
  phone = req.body.phone,
  host = req.get('host');;
  UserInfo.requestCoachPermission(id, phone, host, (err, user) => {
    if(err) {
      return res.sendStatus(500)
    };
    return res.send(null);
  })
}

exports.acceptCoachPermission = (req, res) => {
  const token = req.params.token;
  UserInfo.acceptCoachRequest(token, (err, user) => {
    if(err) {
      return res.sendStatus(500)
    };
    return res.send(user);
  })
}

userLoggerTasks = (msg, task, userId) => {
  userTasksLogger.info(msg,
  {
    userId,
    taskId: task.id,
    taskTitle: task.title,
    taskDescription: task.description,
    taskReward: task.reward,
    taskGroup: task.group,
    taskStatus: task.status
  }
)
}