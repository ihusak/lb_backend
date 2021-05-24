const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notifySchema = new Schema({
  id: String,
  users: [
    {
      id: String
    }
  ],
  title: String,
  description: String,
  type: String,
  hasNotify: {default: false, type: Boolean}
});

module.exports = mongoose.model('Notify', notifySchema);