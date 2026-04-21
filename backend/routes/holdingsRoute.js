const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getAllHoldings } = require("../controller/holdingsController");

router.use(verifyToken);
router.get("/", getAllHoldings);

module.exports = router;
