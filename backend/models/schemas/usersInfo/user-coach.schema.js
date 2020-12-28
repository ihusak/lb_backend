const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userCoachInfo = new Schema({
  id: String,
  userImg: {type: String, default: ''},
  userName: {type: String, default: ''},
  email: {type: String, default: ''},
  aboutMe: {type: String, default: ''},
  bestTrick: {type: String, default: ''},
  phone: {type: String, default: ''},
  ownGroups: [
    {
      id: String,
      name: String
    }
  ],
  role: {
    id: Number,
    name: String,
    status: Boolean
  },
});

module.exports = mongoose.model('UserCoachInfo', userCoachInfo);