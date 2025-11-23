const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  avatar: String,
  followers: [mongoose.Schema.Types.ObjectId],
  following: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model("User", UserSchema);
