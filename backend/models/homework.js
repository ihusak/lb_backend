const db = require('../config/db');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;
const DATA_TABLE = 'homeworks';

exports.createHomework = (homework, cb) => {
  db.get().collection(DATA_TABLE).insertOne(homework, (err, doc) => {
    cb(err, doc);
  });
};

exports.getAllHomeworks = (cb) => {
  db.get().collection(DATA_TABLE).find({}).toArray((err, homeworks) => {
    cb(err, homeworks);
  })
}

exports.likeHomework = (userId, homeworkId, cb) => {
  db.get().collection(DATA_TABLE).findOne({'_id': new ObjectID(homeworkId)}, (err, homework) => {
    if(homework.likes.find(lk => lk === userId)) {
      homework.likes.splice(homework.likes.indexOf(userId), 1);
      db.get().collection(DATA_TABLE).findOneAndUpdate({'_id': new ObjectID(homeworkId)}, {$set: {'likes': homework.likes}})
    } else {
      homework.likes.push(userId);
      db.get().collection(DATA_TABLE).findOneAndUpdate({'_id': new ObjectID(homeworkId)}, {$set: {'likes': homework.likes}})
    }
    cb(err, homework);
  })
}
