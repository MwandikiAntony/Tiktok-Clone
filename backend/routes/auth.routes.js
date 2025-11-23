const router = require("express").Router();
const auth = require("../middleware/auth");

router.get("/me", auth, (req, res) => {
  res.json(req.user); // req.user is set in auth middleware
});

module.exports = router;
