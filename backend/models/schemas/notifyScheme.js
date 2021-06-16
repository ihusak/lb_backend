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
  }
});

module.exports = mongoose.model('Notify', notifySchema);
