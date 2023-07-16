const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

const db = require('../db');
const validateRequest = require('../middleware/validate-request');

const secret = process.env.SECRET;
const User = db.User, Project = db.Project, UserProject = db.UserProject;

module.exports = {
    getProjectList
};

async function getProjectList(req, res, next) {
    if (req.user) {
        try {
            const projectIds = await getProjectIdsByUserId(req.user.id);
            const projectList = await getProjectsById(req.user.id, projectIds);
            console.log(projectList)
            req.user.ProjectList = projectList;
            next(); // go to apiRouter.get('/:companyId')
        } catch (e) {
            console.log(e);
            res.sendStatus(404);
        }
    }
}

async function getProjectIdsByUserId(id) {
    return (await UserProject.findAll({ // if args.id === 1, return user => 2
        where: {
            userId: id,
        },
        raw: true,
        nest: true,
    })).map(x => x.projectId)
}

async function getProjectsById(id, projectIds) {
    return (await UserProject.findAll({
        attributes: [],
        include: [
            {
                model: Project,
                where: {
                    id: {
                        [Sequelize.Op.in]: projectIds,
                    },
                },
            },
        ],
        raw: true,
        nest: true,
    })).map(x => x.Project)
}