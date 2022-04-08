const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({
  fullName: {type: String},
  CPF: {type: String},
  email: {type: String},
  dateOfBirth: Date,
  password: {type: String},
  confirmPassword: {type: String},
});

const User = mongoose.model('User', UserSchema);

module.exports = User;