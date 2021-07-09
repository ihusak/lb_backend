const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    id: String,
    url: String,
    description: String,
    createdBy: {
        id: String,
        name: String
    },
    createdDate: Date,
    likes: {default: [], type: Array},
    verified: {default: false, type: Boolean},
    tags: {default: [], type: Array}
});


module.exports = mongoose.model('Video', videoSchema);
