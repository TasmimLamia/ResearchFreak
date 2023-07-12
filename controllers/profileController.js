const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const db = require('../db');
const validateRequest = require('../middleware/validate-request');

const secret = process.env.SECRET;
const User = db.User, Education = db.Education, Research = db.Research;

module.exports = {
    getProfile, getResearcher
};

async function getProfile(req, res, next) {
    if (req.user) {
        try {
            const user = await getOneUserEducations(req.user.id);
            const education = await getEducationsByUserId(req.user.id);
            const research = await getResearchesByUserId(req.user.id);
            req.user = user;
            req.user.Education = education;
            req.user.Research = research;
            console.log(req.user);
            next(); // go to apiRouter.get('/:companyId')
        } catch (e) {
            console.log(e);
            res.sendStatus(404);
        }
    }
}

async function getResearcher(req, res, next) {
    var id = '';
    if (req.params.id) {
        id = req.params.id;
    }
    else {
        id = req.user.id;
    }

    try {
        const researcher = await getOneUserEducations(id);
        const education = await getEducationsByUserId(id);
        const research = await getResearchesByUserId(id);
        req.researcher = researcher;
        req.researcher.Education = education;
        req.researcher.Research = research;
        console.log(req.researcher);
        next(); // go to apiRouter.get('/:companyId')
    } catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
}

async function getOneUserEducations(id) {
    return User.findByPk(id)
        .then((user) => {
            return user;
        })
        .catch((err) => {
            console.log(">> Error while finding user: ", err);
        });
}

async function getEducationsByUserId(id) {
    return Education.findAll({
        where: { userId: id },
        raw: true,
        nest: true,
    })
        .then((education) => {
            return education;
        })
        .catch((err) => {
            console.log(">> Error while finding education: ", err);
        });
}

async function getResearchesByUserId(id) {
    return Research.findAll({
        where: { userId: id },
        raw: true,
        nest: true,
    })
        .then((research) => {
            return research;
        })
        .catch((err) => {
            console.log(">> Error while finding research: ", err);
        });
}