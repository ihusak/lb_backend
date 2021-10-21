const db = require('../config/db');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;
const StatusTask = require('../models/schemas/taskStatusSchema');

exports.createTask = (task, cb) => {
  db.get().collection('tasks').insertOne(task, (err, doc) => {
    cb(err, doc);
  });
};

exports.changeTaskStatus = (userId, status, cb) => {
  const STATUS_TASK = new StatusTask({

  });
  db.get().collection('tasks-status').findOneAndUpdate({userId}, {$set: }, (err, statusTask) => {
    if(statusTask) {

    } else {

    }
    console.log(statusTask);
  })
}

exports.getAllTasks = (cb) => {
  db.get().collection('tasks').find({}).toArray((err, tasks) => {
    const mappedTasks = tasks.map(task => {
      task.id = task._id;
      delete task._id;
      return task
    });
    cb(err, mappedTasks);
  });
};

exports.getTasksByCourse = (courseId, cb) => {
  db.get().collection('tasks').find({'course.id': courseId}).toArray((err, tasks) => {
    const mappedTasks = tasks.map(task => {
      task.id = task._id;
      delete task._id;
      return task
    });
    cb(err, mappedTasks);
  });
};

exports.getTaskById = (id, cb) => {
  const taskId = new ObjectID(id);
  db.get().collection('tasks').findOne(taskId, (err, task) => {
    cb(err, task);
  });
};

exports.statusTasks = (coachId, courseId, status, cb) => {
  db.get().collection('user-tasks-logs').find({}).toArray((err, tasksHistory) => {
    const processingTasksResult = tasksHistory.filter((task) => {
      if(task.meta.coach.id === coachId && task.meta.taskCourse.id === courseId && task.meta.taskStatus === status) {
        return true;
      }
      return false;
    }).map(task => task.meta);
    cb(err, processingTasksResult);
  });
}

exports.updateTask = (id, task, cb) => {
  const taskId = {"_id": new ObjectID(id)};
  let taskReq = { $set: task };
  db.get().collection('tasks').findOneAndUpdate(taskId, taskReq, {returnOriginal: false}, (err, doc) => {
    cb(err, doc.value);
  })
};

exports.deleteTask = (id, cb) => {
  const taskId = {"_id": new ObjectID(id)};
  db.get().collection('tasks').deleteOne(taskId, (err, doc) => {
    cb(err, doc);
  })
};
