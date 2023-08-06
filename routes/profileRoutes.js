const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();

const authorize = require('../middleware/authorize');
const { getProfile, getResearcher } = require('../controllers/profileController');
const { getById, update, addEducation, addReview } = require('../controllers/userController');

router.get('/', authorize, getProfile, getResearcher, asyncHandler(async (req, res) => {
    if (req.user) {
        res.render("profile.ejs", { user: req.user, researcher: req.researcher });
    }
    else { res.redirect('/signinup'); }
}));

router.get('/:id', authorize, getProfile, getResearcher, asyncHandler(async (req, res) => {
    if (req.user) {
        res.render("profile.ejs", { user: req.user, researcher: req.researcher });
    }
    else { res.redirect('/signinup'); }
}));

router.post('/:userId', authorize, update, asyncHandler(async (req, res) => {
    if (req.user) {
        res.redirect('/profile');
    }
    else { res.redirect('/signinup'); }
}));

router.post('/:userId/education', authorize, addEducation, asyncHandler(async (req, res) => {
    if (req.user) {
        res.redirect('/profile');
    }
    else { res.redirect('/signinup'); }
}));

router.post('/rating/', authorize, addReview, asyncHandler(async (req, res) => {
    if (req.user) {
        res.render("profile.ejs");
    }
    else { res.redirect('/signinup'); }
}));

module.exports = router;