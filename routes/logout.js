const express = require("express");
const router = express.Router();
const LogoutController = require("../controllers/logoutController");

router.get("/", LogoutController.handleLogout);

module.exports = router;
