const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userParentInfo = new Schema({
  id: String,
  userImg: {type: String, default: ''},
  userName: {type: String, default: ''},
  email: {type: String, default: ''},
  aboutMe: {type: String, default: ''},
  socialNetworks: {
    facebook: {type: String, default: ''},
    instagram: {type: String, default: ''},
  },
  phone: {type: String, default: ''},
  myKid: [
    {
      id: String,
      name: String,
      email: String
    }
  ],
  role: {
    id: Number,
    name: String,
    status: Boolean
  },
});

module.exports = mongoose.model('UserParentInfo', userParentInfo);
