const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notifySchema = new Schema({
  id: String,
  author: {
    id: String,
    name: String
  },
  users: [
    {
      id: String,
      name: String
    }
  ] | null,
  title: String,
  type: String,
  userType: Array,
  course: {
    id: String,
    name: String
  } | null,
  homework: {
    id: String,
    name: String
  } | null,
  task: {
    id: String,
    name: String
  } | null
});

module.exports = mongoose.model('Notify', notifySchema);
