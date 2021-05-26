const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notifySchema = new Schema({
  id: String,
  users: [
    {
      id: String,
      name: String
    }
  ],
  title: String,
  description: String,
  userType: String
});

module.exports = mongoose.model('Notify', notifySchema);
