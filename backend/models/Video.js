const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  url: { type: String, required: true },       // file path or URL
  caption: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ user: String, text: String, createdAt: Date }],
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
