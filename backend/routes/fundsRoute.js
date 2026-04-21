const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { getFunds } = require("../controller/fundsController");

router.use(verifyToken);
router.get("/", getFunds);

module.exports = router;