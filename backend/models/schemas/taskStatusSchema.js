const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskStatusSchema = new Schema({
    status: {type: String, default: ''},
    taskId: {type: String, default: ''},
    coachId: {type: String, default: ''},
    userId: {type: String, default: ''},
    reject: {type: String, default: null},
    reviewExample: {type: String, default: null}
});


module.exports = mongoose.model('TaskStatus', taskStatusSchema);
