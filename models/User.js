const { model, Schema } = require('mongoose');

// we define Schema in-order to interact with our db
const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String
});

module.exports = model('User', userSchema);