const UserInfo = require('../models/userInfo');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;
const {userTasksLogger} = require('../config/middleware/logger');

const TaskStatuses = {
  PROCESSING: 'Processing',
  PENDING: 'Pending',
  DONE: "Done"
}

exports.acceptStudentTask = (req, res, next) => {
  const userId = req.params.userId;
  const task = req.body.task;
  UserInfo.acceptTask(userId, task, (err, userInfo) => {
    if(err) return res.sendStatus(500);
    if(!userInfo) {
      const err = {
        errorMessage: 'Not find user',
        errKey: 'CANT_ACCEPT_TASK_NO_USER',
        code: 400
      };
      return next(err);
    }
    return res.json(userInfo);
  })
}

exports.createUserInfo = (req, res) => {
  UserInfo.createUserInfo(req.body, (err, userInfo) => {
    if(err) return res.sendStatus(500);
    return res.json(userInfo.ops[0]);
  })
}

exports.getAllUserInfoByRoleId = (req, res, next) => {
  const roleId = req.params.roleId;
  console.log('getAllUserInfoByRoleId', roleId);
  UserInfo.getAllUserInfo(roleId,(err, usersInfo) => {
    if(usersInfo) {
      delete usersInfo._id;
    }
    if(err) {
      return res.sendStatus(500)
    }
    if(!usersInfo.length) {
      const err = {
        errorMessage: 'Not find users info',
        errKey: 'NO_USERS_INFO',
        code: 400
      };
      return next(err);
    }
    return res.json(usersInfo);
  })
}

exports.getUserInfoByCoach = (req, res, next) => {
  const coachId = req.params.coachId;
  UserInfo.getUserInfoByCoach(coachId, (err, usersInfo) => {
    if(usersInfo) {
      delete usersInfo._id;
    }
    if(err) {
      return res.sendStatus(500)
    }
    if(!usersInfo.length) {
      const err = {
        errorMessage: 'Not find users info',
        errKey: 'NO_USERS_INFO',
        code: 400
      };
      return next(err);
    }
    return res.json(usersInfo);
  })
}


exports.getUserInfo = (req, res, next) => {
  let id = req.user.id;
  let roleId = req.user.roleId;
  UserInfo.getUserInfo(id, roleId, (err, doc) => {
    if(doc) {
      delete doc._id;
    } else {
      const err = {
        errorMessage: 'Not find user info',
        errKey: 'NO_USERINFO',
        code: 400
      };
      return next(err);
    }
    if(err) {
      return res.sendStatus(500)
    }
    return res.json(doc);
  })
}

exports.getUserInfoWithParams = (req, res, next) => {
  let id = req.params.id;
  let roleId = req.params.roleId;
  UserInfo.getUserInfo(id, roleId, (err, doc) => {
    if(doc) {
      delete doc._id;
    } else {
      const err = {
        errorMessage: 'Not find users info',
        errKey: 'NO_USERINFO',
        code: 400
      };
      return next(err);
    }
    if(err) {
      return res.sendStatus(500)
    }
    return res.json(doc);
  })
}

exports.getUsersInfoByCourse = (req, res) => {
  let courseId = req.params.courseId;
  UserInfo.getUsersInfoByCourse(courseId, (err, doc) => {
    if(doc) {
      delete doc._id;
    };
    if(err) {
      return res.sendStatus(500)
    };
    return res.json(doc);
  })
}

exports.updateUserInfo = (req, res, next) => {
  const id = req.user.id;
  const userInfo = req.body.userInfo;
  const roleId = req.user.roleId;
  UserInfo.updateUserInfo(id, userInfo, req.file, roleId, (err, doc) => {
    if(err) {
      return res.sendStatus(500);
    }
    if(!doc) {
      const err = {
        errorMessage: 'Didn\'t update userInfo',
        errKey: 'DIDNT_UPDATE_USERINFO',
        code: 400
      };
      return next(err);
    }
    return res.json(doc);
  })
}

exports.changeTaskStatus = (req, res) => {
  let id = req.params.userId;
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
  host = req.get('origin');
  UserInfo.requestCoachPermission(id, phone, host, (err, user) => {
    if(err) {
      return res.sendStatus(500)
    };
    return res.send(null);
  })
}

exports.acceptCoachPermission = (req, res, next) => {
  const token = req.params.token;
  UserInfo.acceptCoachRequest(token, (err, user) => {
    if(err) {
      return res.sendStatus(500)
    }
    if(!user) {
      const err = {
        errorMessage: 'Not find user',
        errKey: 'NO_USER',
        code: 400
      };
      return next(err);
    }
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
    taskCourse: task.course,
    taskStatus: task.status
  }
)
}
