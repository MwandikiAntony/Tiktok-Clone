const router = require("express").Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Video = require("../models/Video");

const storage = multer.diskStorage({});
const upload = multer({ storage });

// Upload video
router.post("/upload", auth, upload.single("video"), async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "video"
  });

  const video = await Video.create({
    userId: req.user.id,
    url: result.secure_url,
    caption: req.body.caption
  });

  res.json(video);
});

// Get feed (infinite scroll)
router.get("/feed", async (req, res) => {
  const { cursor } = req.query;

  const query = cursor ? { _id: { $lt: cursor } } : {};

  const videos = await Video.find(query)
    .sort({ _id: -1 })
    .limit(10);

  res.json({
    videos,
    nextCursor: videos.length ? videos[videos.length - 1]._id : null
  });
});

module.exports = router;
