const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();


const authorize = require('../middleware/authorize');
const { getProfile, getResearcher } = require('../controllers/profileController');
const { getProject, getProjectList, createProject, updateProject, addContributor, removeContributor } = require('../controllers/projectController');

router.get('/', authorize, getProfile, getResearcher, getProjectList, asyncHandler(async (req, res) => {
    res.render('projects.ejs', { user: req.user, researcher: req.researcher });
}));

router.post('/', authorize, createProject, asyncHandler(async (req, res) => {
    res.redirect('/projects');
}));

router.get('/:projectId', authorize, getProfile, getResearcher, getProject, asyncHandler(async (req, res) => {
    res.render('project.ejs', { user: req.user, researcher: req.researcher, project: req.project });
}));

router.post('/:projectId', authorize, updateProject, asyncHandler(async (req, res) => {
    res.redirect(`/projects/${req.params.projectId}`);
}));

router.post('/:projectId/addContributor/:userId', authorize, addContributor, asyncHandler(async (req, res) => {
    res.redirect(`/projects/${req.params.projectId}`);
}));

router.post('/:projectId/removeContributor/:userId', authorize, removeContributor, asyncHandler(async (req, res) => {
    res.redirect(`/projects/${req.params.projectId}`);
}));

module.exports = router;