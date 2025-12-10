const express = require("express");
const router = express.Router();

const { loginUser, registerUser } = require("../controller/userController");

console.log("DEBUG:", loginUser, registerUser);

router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
