const db = require('../config/db');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;
const dbName = 'videos';

exports.create = (video, cb) => {
    db.get().collection(dbName).insertOne(video, (err, result) => {
        const returnVideo = result.ops.map(video => {
            video.id = video._id;
            delete video._id;
            return video;
        })[0];
        cb(err, returnVideo)
    })
}
exports.getAllVideoPosts = (cb) => {
    db.get().collection(dbName).find({}).toArray((err, videosData) => {
        const mappedVideos = videosData.map(video => {
            video.id = video._id;
            delete video._id;
            return video
        });
        cb(err, mappedVideos)
    })
}
exports.delete = (videoId, cb) => {
    db.get().collection(dbName).deleteOne({_id: new ObjectID(videoId)}, (err, doc) => {
        cb(err, doc);
    });
}
exports.like = (videoId, userId, cb) => {
    console.log(videoId, userId);
   db.get().collection(dbName).findOne({'_id': new ObjectID(videoId)}, (err, video) => {
    if(video.likes.find(lk => lk === userId)) {
      video.likes.splice(video.likes.indexOf(userId), 1);
      db.get().collection(dbName).findOneAndUpdate({'_id': new ObjectID(videoId)}, {$set: {'likes': video.likes}})
    } else {
      video.likes.push(userId);
      db.get().collection(dbName).findOneAndUpdate({'_id': new ObjectID(videoId)}, {$set: {'likes': video.likes}})
    }
    cb(err, video);
  })
}
exports.verify = (videoId, cb) => {
    console.log(videoId);
    db.get().collection(dbName).findOneAndUpdate({_id: new ObjectID(videoId)}, {$set: {'verified': true}}, (err, doc) => {
        cb(err, doc);
    });
}
