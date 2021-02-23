const Task = require('../models/task');
const TaskModel = require('../models/schemas/taskSchema');

exports.createTask = (req, res) => {
  const task = new TaskModel({
    title: req.body.title,
    description: req.body.description,
    example: req.body.example,
    reward: req.body.reward,
    nextTask: {id: req.body.nextTask.id},
    course: {
      id: req.body.course.id,
      name: req.body.course.name,
    },
    allow: req.body.allow
  });
  Task.createTask(task, (err, task) => {
    if(err) return res.sendStatus(500);
    return res.json(task);
  })
}

exports.getAllTasks = (req, res) => {
  Task.getAllTasks((err, tasks) => {
    if(err) return res.sendStatus(500);
    return res.json(tasks);
  })
}

exports.getTasksByCourse = (req, res) => {
  const courseId = req.params.courseId;
  Task.getTasksByCourse(courseId, (err, tasks) => {
    if(err) return res.sendStatus(500);
    return res.json(tasks);
  })
}

exports.getTaskById = (req, res) => {
  const taskId = req.params.id;
  Task.getTaskById(taskId, (err, task) => {
    if(err) return res.sendStatus(500);
    return res.json(task);
  })
}

exports.getStatusTasks = (req, res) => {
  let coachId = req.params.coachId;
  let courseId = parseInt(req.params.courseId);
  let status = req.body.status;
  Task.statusTasks(coachId, courseId, status, (err, result) => {
    if(err) return res.sendStatus(500);
    return res.json(result);
  })
}

exports.updateTask = (req, res) => {
  const task = {
    title: req.body.title,
    description: req.body.description,
    example: req.body.example,
    reward: req.body.reward,
    nextTask: {id: req.body.nextTask.id},
    course: {
      id: req.body.course.id,
      name: req.body.course.name,
    }
  };
  const taskId = req.params.id;
  Task.updateTask(taskId, task, (err, tasks) => {
    if(err) return res.sendStatus(500);
    return res.json(tasks);
  })
}

exports.deleteTaskById = (req, res) => {
  const taskId = req.params.id;
  Task.deleteTask(taskId, (err, task) => {
    if(err) return res.sendStatus(500);
    return res.json(task);
  })
}
