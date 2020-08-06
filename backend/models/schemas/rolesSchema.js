const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rolesSchema = new Schema({
  name: String,
  id: Number,
  status: Boolean
});


module.exports = mongoose.model('Roles', rolesSchema);