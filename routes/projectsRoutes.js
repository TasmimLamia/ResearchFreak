const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();


const authorize = require('../middleware/authorize');
const { getProfile } = require('../controllers/profileController');

router.get('/', authorize, getProfile, asyncHandler(async (req, res) => {
    res.render('projects.ejs', { user: req.user });
}));

router.get('/1', authorize, getProfile, asyncHandler(async (req, res) => {
    res.render('project.ejs', { user: req.user });
}));

module.exports = router;