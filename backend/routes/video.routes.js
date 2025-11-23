const router = require("express").Router();
const auth = require("../middleware/auth");
const Video = require("../models/Video");

// Like/unlike video
router.post("/like/:id", auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;
    if (video.likes.includes(userId)) {
      video.likes = video.likes.filter((id) => id.toString() !== userId);
    } else {
      video.likes.push(userId);
    }

    await video.save();
    res.json({ likes: video.likes.length, liked: video.likes.includes(userId) });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Add comment
router.post("/comment/:id", auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = {
      user: req.user.id,
      text: req.body.text,
      createdAt: new Date(),
    };

    video.comments.push(comment);
    await video.save();

    res.json(video.comments);
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
