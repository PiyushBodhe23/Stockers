const express = require("express");
const router = express.Router();

const { getAllPositions } = require("../controller/positionsController");

router.get("/", getAllPositions);

module.exports = router;
