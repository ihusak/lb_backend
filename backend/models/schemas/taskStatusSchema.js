const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskStatusSchema = new Schema({
    title: {type: String},
    description: {type: String},
    example: {type: String},
    reward: {type: Number},
    nextTask: {id: String},
    course: {
        id: {type: String},
        name: {type: String},
    },
    reviewExample: {type: String},
    reject: {type: String},
    coach: {
        id: String,
        name: String
    },
    user: {
        id: String,
        name: String
    },
});


module.exports = mongoose.model('TaskStatus', taskStatusSchema);
