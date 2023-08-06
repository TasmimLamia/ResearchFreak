const express = require('express');
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const userService = require('../services/userService');

module.exports = { getAll, getCurrent, getById, updateSchema, update, delete: _delete, addEducation, addReview };

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
    userService.update(req.params.userId, req.body)
        .then(user => res.redirect("/profile"))
        .catch(next);
}

function addEducation(req, res, next) {
    userService.addEducation(req.params.userId, req.body)
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