const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();

const authorize = require('../middleware/authorize');
const { getProfile } = require('../controllers/profileController');

router.get('/', authorize, getProfile, asyncHandler(async (req, res) => {
    if (req.user) {
        res.render("profile.ejs", { user: req.user });
    }
    else { res.redirect('/signinup'); }
}));

module.exports = router;