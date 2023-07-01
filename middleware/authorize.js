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
                return res.status(401).json({ message: 'Unauthorized' });
            req.user = user.get();
        }
        next();
    } catch (err) {
        return res.status(401).json({ "msg": "Couldnt Authenticate" });
    }
}

module.exports = authorize;