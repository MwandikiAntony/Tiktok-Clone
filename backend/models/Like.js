const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  videoId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model("Like", LikeSchema);
