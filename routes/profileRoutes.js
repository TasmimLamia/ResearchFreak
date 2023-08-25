const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();

const authorize = require('../middleware/authorize');
const { getProfile, getResearcher, createEducation, updateEducation, deleteEducation, createResearch, updateResearch, deleteResearch, createReview } = require('../controllers/profileController');
const { update } = require('../controllers/userController');

router.get('/', authorize, getProfile, getResearcher, asyncHandler(async (req, res) => {
    if (req.user) {
        res.render("profile.ejs", { user: req.user, researcher: req.researcher });
    }
    else {
        res.redirect('/signinup');
    }
}));

router.post('/', authorize, update, asyncHandler(async (req, res) => {
    if (req.user) {
        res.redirect('/profile');
    }
    else { res.redirect('/signinup'); }
}));

router.get('/:id', authorize, getProfile, getResearcher, asyncHandler(async (req, res) => {
    if (req.user) {
        res.render("profile.ejs", { user: req.user, researcher: req.researcher, requestedUser: req.requestedUser, requesterUser: req.requesterUser, connectionStatus: req.connectionStatus, revieweeStatus: req.revieweeStatus });
    }
    else { res.redirect('/signinup'); }
}));

router.post('/education', authorize, createEducation, asyncHandler(async (req, res) => {
    if (req.user) {
        res.redirect('/profile');
    }
    else { res.redirect('/signinup'); }
}));

router.post('/education/:eduId', authorize, updateEducation, asyncHandler(async (req, res) => {
    if (req.user) {
        res.redirect('/profile');
    }
    else { res.redirect('/signinup'); }
}));

router.post('/education/delete/:eduId', authorize, deleteEducation, asyncHandler(async (req, res) => {
    if (req.user) {
        res.redirect('/profile');
    }
    else { res.redirect('/signinup'); }
}));

router.post('/research', authorize, createResearch, asyncHandler(async (req, res) => {
    if (req.user) {
        res.redirect('/profile');
    }
    else { res.redirect('/signinup'); }
}));

router.post('/research/:researchId', authorize, updateResearch, asyncHandler(async (req, res) => {
    if (req.user) {
        res.redirect('/profile');
    }
    else { res.redirect('/signinup'); }
}));

router.post('/research/delete/:researchId', authorize, deleteResearch, asyncHandler(async (req, res) => {
    if (req.user) {
        res.redirect('/profile');
    }
    else { res.redirect('/signinup'); }
}));

router.post('/review/:revieweeId', authorize, createReview, asyncHandler(async (req, res) => {
    if (req.user) {
        res.redirect(`/profile/${req.params.revieweeId}`);
    }
    else { res.redirect('/signinup'); }
}));

module.exports = router;