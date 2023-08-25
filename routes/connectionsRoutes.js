const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();

const authorize = require('../middleware/authorize');
const { getProfile, getResearcher } = require('../controllers/profileController');
const { getConnections, addConnection, removeConnection, addRequest, cancelRequest, removeRequest } = require("../controllers/connectionController");

router.get('/', authorize, getProfile, getResearcher, getConnections, asyncHandler(async (req, res) => {
    res.render('connections.ejs', { user: req.user, researcher: req.researcher });
}));

router.post('/addConnection/:connectId', authorize, getProfile, getResearcher, addConnection, asyncHandler(async (req, res) => {
    res.redirect(`/profile/${req.params.connectId}`);
}));

router.post('/removeConnection/:connectId', authorize, getProfile, getResearcher, removeConnection, asyncHandler(async (req, res) => {
    res.redirect(`/profile/${req.params.connectId}`);
}));


router.post('/addRequest/:userId', authorize, getProfile, getResearcher, addRequest, asyncHandler(async (req, res) => {
    res.redirect(`/profile/${req.params.userId}`);
}));

router.post('/cancelRequest/:userId', authorize, getProfile, getResearcher, cancelRequest, asyncHandler(async (req, res) => {
    res.redirect(`/profile/${req.params.userId}`);
}));

router.post('/removeRequest/:requesterId', authorize, getProfile, getResearcher, removeRequest, asyncHandler(async (req, res) => {
    res.redirect(`/profile/${req.params.requesterId}`);
}));

module.exports = router;