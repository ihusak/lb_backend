const db = require('../config/db');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;
const TaskStatus = require('../models/schemas/taskStatusSchema');
const TaskStatusesEnum = require('../config/enum/taskStatuses');

exports.acceptTask = (task, cb) => {
  db.get().collection('userStudentInfo').updateOne({id: task.userId}, {$set: {reviewExample: body.reviewExample}}, (err, doc) => {
    cb(err, doc);
  });
};

exports.createTask = (task, cb) => {
  db.get().collection('tasks').insertOne(task, (err, doc) => {
    cb(err, doc);
  });
};

exports.changeTaskStatus = (statusTask, cb) => {
  console.log(statusTask);
  const body = new TaskStatus({
    status: statusTask.status,
    taskId: statusTask.taskId,
    coachId: statusTask.coachId,
    userId: statusTask.userId,
    reviewExample: statusTask.reviewExample
  });
  switch (statusTask.status) {
    case TaskStatusesEnum.PROCESSING:
      db.get().collection('tasks-status').findOne({userId: body.userId, taskId: body.taskId}, (err, foundStatusTask) => {
        console.log('foundStatusTask', foundStatusTask);
        if(!foundStatusTask) {
          db.get().collection('tasks-status').insertOne(body, (err, response) => {
            cb(err, response);
          })
        } else {
          db.get().collection('tasks-status').updateOne({userId: body.userId, taskId: body.taskId},{$set: {reviewExample: body.reviewExample}}, (err, response) => {
            cb(err, response);
          })
        }
      })
      break;
    case TaskStatusesEnum.PENDING:
      db.get().collection('tasks-status').findOne({userId: body.userId, taskId: body.taskId}, (err, foundStatusTask) => {
        console.log('foundStatusTask', foundStatusTask);
        if(!foundStatusTask) {
          db.get().collection('tasks-status').insertOne(body, (err, response) => {
            cb(err, response);
          })
        } else {
          db.get().collection('tasks-status').updateOne({userId: body.userId, taskId: body.taskId},{$set: {reviewExample: body.reviewExample}}, (err, response) => {
            cb(err, response);
          })
        }
      })
      break;
    case TaskStatusesEnum.DONE:
      break;
  }
}

exports.getTaskStatusesByCoach = (coachId, cb) => {
  db.get().collection('tasks-status').find({coachId}).toArray((err, taskStatuses) => {
    const taskStatusesMapped = taskStatuses.map((task) => {
      task.id = task._id;
      delete task._id;
      return task;
    })
    cb(err, taskStatusesMapped)
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
