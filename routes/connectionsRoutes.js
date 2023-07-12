const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();

const authorize = require('../middleware/authorize');
const authController = require('../controllers/authController');
const { getProfile } = require("../controllers/profileController");
const { getConnections } = require("../controllers/connectionController");

router.get('/', authorize, getProfile, getConnections, asyncHandler(async (req, res) => {
    res.render('connections.ejs', { user: req.user });
}));

module.exports = router;