const express = require("express");
const router = express.Router();
const { getAllHoldings } = require("../controller/holdingsController");

router.get("/", getAllHoldings);

module.exports = router;
