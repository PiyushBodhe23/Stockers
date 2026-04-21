const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getAllPositions } = require("../controller/positionsController");

router.use(verifyToken);
router.get("/", getAllPositions);

module.exports = router;
