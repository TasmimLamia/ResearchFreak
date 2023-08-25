const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../db');

const secret = process.env.SECRET;

async function authorize(req, res, next) {
    try {
        if (req.cookies.userToken) {
            let token = req.cookies.userToken;
            let decoded = jwt.verify(token, secret);
            const user = await db.User.findByPk(decoded.id);
            if (!user)
                return res.redirect('/signinup');
            req.user = user.get();
            next();
        }
        else {
            return res.redirect('/signinup');
        }
    } catch (err) {
        console.error(err);
        return res.redirect('/signinup');
    }
}

module.exports = authorize;