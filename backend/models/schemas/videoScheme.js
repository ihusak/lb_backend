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
    likes: Array,
    verified: {default: false, type: Boolean},
    tags: Array
});


module.exports = mongoose.model('Video', videoSchema);
