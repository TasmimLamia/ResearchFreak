const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();

const authorize = require('../middleware/authorize');
const authController = require('../controllers/authController');

router.get('/', authorize, asyncHandler(async (req, res) => {
    res.render('connections.ejs');
}));

module.exports = router;