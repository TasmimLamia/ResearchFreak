const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();


const authorize = require('../middleware/authorize');
const { getProfile, getResearcher } = require('../controllers/profileController');
const { getProject, getProjectList, updateProject } = require('../controllers/projectController');

router.get('/', authorize, getProfile, getResearcher, getProjectList, asyncHandler(async (req, res) => {
    res.render('projects.ejs', { user: req.user, researcher: req.researcher });
}));

router.get('/:id', authorize, getProfile, getResearcher, getProject, asyncHandler(async (req, res) => {
    res.render('project.ejs', { user: req.user, researcher: req.researcher, project: req.project });
}));

router.post('/:projectId', authorize, updateProject, asyncHandler(async (req, res) => {
    res.render('project.ejs');
}));

module.exports = router;