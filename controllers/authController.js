const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const validateRequest = require('../middleware/validate-request');

const secret = process.env.SECRET;

module.exports = {
    authenticateSchema, authenticate, registerSchema, register, logout
};

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

async function authenticate(req, res, next) {
    const user = await db.User.scope('withPassword').findOne({ where: { email: req.body.email } });

    if (!user || !(await bcrypt.compare(req.body.password, user.password)))
        res.status(400).json({ error: 'Username or password is incorrect' });

    // authentication successful
    const token = jwt.sign({ "id": user.id, "email": user.email, "username": user.username }, secret, { expiresIn: '7d' });
    const cookieOptions = {
        expiresIn: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    res.cookie("userToken", token, cookieOptions);
    res.status(200).redirect("/profile");
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    });
    validateRequest(req, next, schema);
}

async function register(req, res, next) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (await db.User.findOne({ where: { username: username } })) {
        res.status(400).json({ error: 'Username "' + username + '" is already taken' });
    }

    // hash password
    if (password) {
        req.body.password = await bcrypt.hash(password, 10);
    }

    // save user
    created_user = await db.User.create(req.body);
    res.status(201).redirect("/signinup");
}

async function logout(req, res, next) {
    res.cookie("userToken", "logout", {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
    });

    res.status(200).redirect("/signinup");
}