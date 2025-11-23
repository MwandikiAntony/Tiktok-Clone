const router = require("express").Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Video = require("../models/Video");

// Multer config (temporary local storage before uploading to Cloudinary)
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Upload video
router.post("/upload", auth, upload.single("video"), async (req, res) => {
  try {
    // 1️⃣ Check auth
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 2️⃣ Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No video uploaded" });
    }

    // 3️⃣ Upload to Cloudinary
    let result;
    try {
      result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video"
      });
    } catch (cloudErr) {
      console.error("Cloudinary upload error:", cloudErr);
      return res.status(400).json({ message: "Cloudinary upload failed", error: cloudErr.message });
    }

    // 4️⃣ Save video info in DB
    let video;
    try {
      video = await Video.create({
        user: req.user.id,  // Must match schema field 'user'
        url: result.secure_url,
        caption: req.body.caption || ""
      });
    } catch (dbErr) {
      console.error("MongoDB save error:", dbErr);
      if (dbErr.name === "ValidationError") {
        return res.status(400).json({ message: "Invalid video data", errors: dbErr.errors });
      }
      return res.status(500).json({ message: "Database error", error: dbErr.message });
    }

    // 5️⃣ Success
    res.status(201).json(video);

  } catch (err) {
    console.error("Unexpected upload error:", err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// Get feed (infinite scroll)
router.get("/feed", async (req, res) => {
  try {
    const { cursor } = req.query;
    const query = cursor ? { _id: { $lt: cursor } } : {};

    const videos = await Video.find(query)
      .sort({ _id: -1 })
      .limit(10);

    res.json({
      videos,
      nextCursor: videos.length ? videos[videos.length - 1]._id : null
    });
  } catch (err) {
    console.error("Feed error:", err);
    res.status(500).json({ message: err.message });
  }
});

const Like = require("../models/Like");

router.post("/like/:id", auth, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;

    // Check if like already exists
    let like = await Like.findOne({ videoId, userId });

    if (like) {
      // Unlike
      await like.deleteOne();
    } else {
      // Like
      like = await Like.create({ videoId, userId });
    }

    // Return total likes for video
    const likesCount = await Like.countDocuments({ videoId });
    res.json({ likes: likesCount, liked: !like ? false : true });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: err.message });
  }
});


const Comment = require("../models/Comment");

router.post("/comment/:id", auth, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const comment = await Comment.create({
      videoId,
      userId,
      text,
    });

    // Optionally, return all comments for the video
    const comments = await Comment.find({ videoId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
