const Videos = require('../models/videos');
const Video = require('../models/schemas/videoScheme');

exports.createVideoPost = (req, res) => {
    const newVideo = new Video({
        url: req.body.url,
        createdBy: {
            id: req.body.author.id,
            name: req.body.author.name
        },
        createdDate: new Date(),
        description: req.body.description
    });
    Videos.create(newVideo, (err, returnVideo) => {
        if(err) return res.sendStatus(500);
        return res.json(returnVideo);
    });
}
exports.getAllVideoPosts = (req, res) => {
    Videos.getAllVideoPosts((err, allVideos) => {
        if(err) return res.sendStatus(500);
        return res.json(allVideos);
    });
}
exports.deleteVideoPost = (req, res) => {
  const videoId = req.body.videoId;
  Videos.delete(videoId, (err, video) => {
    if(err) return res.sendStatus(500);
    return res.json({status: 'delete', ok: true});
  })
}
exports.likeVideoPost = (req, res) => {
  const videoId = req.body.videoId;
  const userId = req.user.id;
  Videos.like(videoId, userId, (err, video) => {
    if(err) return res.sendStatus(500);
    return res.json(video);
  });
}
exports.verifyVideoPost = (req, res) => {
    const videoId = req.body.videoId;
    const userId = req.body.userId;
    Videos.verify(videoId, userId, (err, video) => {
        if(err) return res.sendStatus(500);
        return res.json({status: 'verified', ok: true});
    });
}

