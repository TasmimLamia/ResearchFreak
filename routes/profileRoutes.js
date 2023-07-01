const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();

const authorize = require('../middleware/authorize');
const authController = require('../controllers/authController');

router.get('/', authorize, asyncHandler(async (req, res) => {
    if (req.user) {
        res.render("profile.ejs", { user: req.user });
    }
    else { res.redirect('/signinup'); }
}));

module.exports = router;