const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userInfoAdmin = new Schema({
  id: String,
  userImg: {type: String, default: ''},
  userName: {type: String, default: ''},
  email: {type: String, default: ''},
  phone: {type: String, default: ''},
  role: {
    id: Number,
    name: String,
    status: Boolean
  }
});

module.exports = mongoose.model('UserInfoAdmin', userInfoAdmin);