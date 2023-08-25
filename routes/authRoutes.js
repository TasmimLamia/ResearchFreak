const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();

const { authenticateSchema, authenticate, registerSchema, register, logout } = require('../controllers/authController');

router.get('/', asyncHandler(async (req, res) => {
    res.redirect('/profile');
}));
router.get('/signinup', asyncHandler(async (req, res) => {
    if (req.cookies.userToken) {
        res.redirect('/profile');
    }
    else {
        res.render('signinup.ejs');
    }
}));
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/signout', logout);


module.exports = router;