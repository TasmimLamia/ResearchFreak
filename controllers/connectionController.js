const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const db = require('../db');
const validateRequest = require('../middleware/validate-request');

const secret = process.env.SECRET;
const User = db.User, Connection = db.Connection, ConnectionRequest = db.ConnectionRequest;

module.exports = {
    getConnections, addConnection, removeConnection, addRequest, cancelRequest, removeRequest
};

async function getConnections(req, res, next) {
    if (req.user) {
        try {
            const user = await User.findOne({
                where: { id: req.user.id }
            });
            req.user.Connection = await user.getConnectingUsers();
            req.user.Requester = await user.getRequesterUsers();
            req.user.Requested = await user.getRequestedUsers();
            next();
        } catch (e) {
            console.log(e);
            res.sendStatus(404);
        }
    }
}

async function getMainUser(id) {
    return await User.findByPk(id)
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
            as: 'connectingUsers'
        }],
        order: [
            ['connectingUsers', 'createdAt', 'DESC'],
        ],
        raw: true,
        nest: true,
    })).map(x => x.connectingUsers)
}

async function addConnection(req, res, next) {
    try {
        await User.findByPk(req.user.id).then(async mainUser => {
            await User.findByPk(req.params.connectId).then(connectingUser => {
                connectingUser.removeRequestedUsers(mainUser);
                mainUser.addConnectingUsers(connectingUser);
                connectingUser.addConnectingUsers(mainUser);
            });
        });
        next();
    } catch (error) {
        console.log(e);
        res.sendStatus(404);
    }
}

async function removeConnection(req, res, next) {
    try {
        await User.findByPk(req.user.id).then(async mainUser => {
            await User.findByPk(req.params.connectId).then(connectingUser => {
                mainUser.removeConnectingUsers(connectingUser);
                connectingUser.removeConnectingUsers(mainUser);
            });
        });
        next();
    } catch (error) {
        console.log(e);
        res.sendStatus(404);
    }
}

async function addRequest(req, res, next) {
    try {
        await User.findByPk(req.user.id).then(async requesterUser => {
            await User.findByPk(req.params.userId).then(requestedUser => {
                requesterUser.addRequestedUsers(requestedUser);
            });
        });
        next();
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
}

async function cancelRequest(req, res, next) {
    try {
        await User.findByPk(req.user.id).then(async requesterUser => {
            await User.findByPk(req.params.userId).then(requestedUser => {
                requesterUser.removeRequestedUsers(requestedUser);
            });
        });
        next();
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
}

async function removeRequest(req, res, next) {
    try {
        await User.findByPk(req.user.id).then(async requestedUser => {
            await User.findByPk(req.params.requesterId).then(requesterUser => {
                requesterUser.removeRequestedUsers(requestedUser);
            });
        });
        next();
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
}