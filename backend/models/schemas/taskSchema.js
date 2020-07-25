const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: String,
  id: String
});


module.exports = mongoose.model('Task', taskSchema);