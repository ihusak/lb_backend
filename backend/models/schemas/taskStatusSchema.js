const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskStatusSchema = new Schema({
    title: {type: String},
    description: {type: String},
    example: {type: String},
    course: {
        id: {type: String},
        name: {type: String},
    },
    status: {type: String, default: ''}
});


module.exports = mongoose.model('TaskStatus', taskStatusSchema);
