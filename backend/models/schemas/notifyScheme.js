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
  ],
  title: String,
  type: String,
  userType: String
});

module.exports = mongoose.model('Notify', notifySchema);
