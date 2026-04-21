const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const { getAllOrders, createOrder } = require("../controller/ordersController");

router.use(verifyToken);
router.get("/", getAllOrders);
router.post("/", createOrder);

module.exports = router;
