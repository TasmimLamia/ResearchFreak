const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const db = require('../db');
const validateRequest = require('../middleware/validate-request');

const secret = process.env.SECRET;
const User = db.User, Connection = db.Connection;

module.exports = {
    getConnections
};

async function getConnections(req, res, next) {
    if (req.user) {
        try {
            const user = await getOneUserEducations(req.user.id);
            const connection = await getConnectionsByUserId(req.user.id);
            req.user = user;
            req.user.Connection = connection;
            next(); // go to apiRouter.get('/:companyId')
        } catch (e) {
            console.log(e);
            res.sendStatus(404);
        }
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

async function getConnectionsByUserId(id) {
    return (await Connection.findAll({ // if args.id === 1, return user => 2
        where: {
            userId: id,
        },
        include: [{
            model: User,
            as: 'connectingUserId',
        }],
        order: [
            ['connectingUserId', 'createdAt', 'DESC'],
        ],
        raw: true,
        nest: true,
    })).map(x => x.connectingUserId)
}