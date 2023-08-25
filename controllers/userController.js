const express = require('express');
const { Sequelize } = require('sequelize');
const Joi = require('joi');

const db = require('../db');
const validateRequest = require('../middleware/validate-request');
const userService = require('../services/userService');

const User = db.User, Education = db.Education, Research = db.Research, Review = db.Review;

module.exports = { getAll, getCurrent, getById, updateSchema, update, delete: _delete, addReview, search };

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userService.update(req.user.id, req.body)
        .then(user => res.redirect("/profile"))
        .catch(next);
}

function addReview(req, res, next) {
    userService.addEducation(req.params.userId, req.body)
        .then(user => res.redirect("/profile"))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}

async function search(req, res, next) {
    console.log(req.body);
    await User.findAll({
        where: { username: { [Sequelize.Op.like]: `%${req.body.search}%` }, },
        raw: true,
        nest: true,
    })
        .then((user) => {
            req.search = user;
            next();
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
}