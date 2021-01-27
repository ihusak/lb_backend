const Task = require('../models/task');
const TaskModel = require('../models/schemas/taskSchema');

exports.createTask = (req, res) => {
  const task = new TaskModel({
    title: req.body.title,
    description: req.body.description,
    example: req.body.example,
    reward: req.body.reward,
    nextTask: {id: req.body.nextTask.id},
    group: {
      id: req.body.group.id,
      name: req.body.group.name,
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

exports.getTasksByGroup = (req, res) => {
  const groupId = req.params.groupId;
  Task.getTasksByGroup(groupId, (err, tasks) => {
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
  let groupId = parseInt(req.params.groupId);
  let status = req.body.status;
  Task.statusTasks(coachId, groupId, status, (err, result) => {
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
    group: {
      id: req.body.group.id,
      name: req.body.group.name,
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
