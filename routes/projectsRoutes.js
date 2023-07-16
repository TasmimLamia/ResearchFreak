const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();


const authorize = require('../middleware/authorize');
const { getProfile, getResearcher } = require('../controllers/profileController');
const { getProjectList } = require('../controllers/projectController');

router.get('/', authorize, getProfile, getResearcher, getProjectList, asyncHandler(async (req, res) => {
    res.render('projects.ejs', { user: req.user, researcher: req.researcher });
}));

router.get('/1', authorize, getProfile, getResearcher, asyncHandler(async (req, res) => {
    res.render('project.ejs', { user: req.user, researcher: req.researcher });
}));

module.exports = router;