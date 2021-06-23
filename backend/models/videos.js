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
