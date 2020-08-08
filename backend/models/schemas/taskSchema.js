const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {type: String},
  description: {type: String},
  example: {type: String},
  allow: {type: Boolean, default: false},
  reward: {type: Number, default: 0},
  nextTask: {id: String},
  group: {
    id: {type: String},
    name: {type: String},
  },
  reviewExample: {type: String, default: ''}
});


module.exports = mongoose.model('Task', taskSchema);