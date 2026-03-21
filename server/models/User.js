const mongoose = require('mongoose'); 

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Patient' },
  phone: { type: String },
  age: { type: Number },
  gender: { type: String }
});

module.exports = mongoose.model('User', UserSchema);