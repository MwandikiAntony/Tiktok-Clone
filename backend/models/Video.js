const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  url: String,
  caption: String,
  thumbnail: String,
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Video", VideoSchema);
