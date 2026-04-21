const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require("../controller/watchlistController");

router.use(verifyToken);
router.get("/", getWatchlist);
router.post("/", addToWatchlist);
router.delete("/:id", removeFromWatchlist);

module.exports = router;