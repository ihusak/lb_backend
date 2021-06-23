const Videos = require('../models/videos');
const Video = require('../models/schemas/videoScheme');

exports.createVideoPost = (req, res) => {
    const newVideo = new Video({
        url: req.body.url,
        createdBy: {
            id: req.body.author.id,
            name: req.body.author.name
        },
        createdDate: new Date()
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
