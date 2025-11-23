const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  videoId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", CommentSchema);
