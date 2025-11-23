const router = require("express").Router();
const auth = require("../middleware/auth");
const Comment = require("../models/Comment");

router.post("/:videoId", auth, async (req, res) => {
  const comment = await Comment.create({
    videoId: req.params.videoId,
    userId: req.user.id,
    text: req.body.text
  });
  res.json(comment);
});

router.get("/:videoId", async (req, res) => {
  const comments = await Comment.find({ videoId: req.params.videoId });
  res.json(comments);
});

module.exports = router;
