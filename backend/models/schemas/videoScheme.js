const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    id: String,
    url: String,
    createdBy: {
        id: String,
        name: String
    },
    createdDate: Date,
    likes: Array
});


module.exports = mongoose.model('Video', videoSchema);
