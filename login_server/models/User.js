const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
  fullName: String,
  CPF: String,
  dateOfBirth: Date,
  email: String,
  password: String,
  confirmPassword: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;