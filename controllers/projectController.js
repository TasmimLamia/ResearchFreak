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
    getProject, getProjectList, updateProject
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

async function getProject(req, res, next) {
    if (req.params.id) {
        try {
            const project = await Project.findByPk(req.params.id);
            if (!project) {
                res.sendStatus(404);
            };
            const contributorIds = await getContributorIdsByProjectId(project.id);
            const contributorList = await getContributorsById(req.params.id, contributorIds);
            console.log(contributorList)
            req.project = project;
            req.project.ContributorList = contributorList;
            next(); // go to apiRouter.get('/:companyId')
        } catch (e) {
            console.log(e);
            res.sendStatus(404);
        }
    }
}

async function getContributorIdsByProjectId(id) {
    return (await UserProject.findAll({ // if args.id === 1, return user => 2
        where: {
            projectId: id,
        },
        raw: true,
        nest: true,
    })).map(x => x.userId)
}

async function getContributorsById(id, userIds) {
    return (await UserProject.findAll({
        attributes: [],
        include: [
            {
                model: User,
                where: {
                    id: {
                        [Sequelize.Op.in]: userIds,
                    },
                },
            },
        ],
        raw: true,
        nest: true,
    })).map(x => x.User)
}

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

function updateProject(req, res, next) {
    update(req.params.projectId, req.body)
        .then(user => res.redirect("/projects/" + req.params.projectId))
        .catch(next);
}

async function update(id, params) {
    const project = await db.Project.findByPk(id);

    // copy params to user and save
    Object.assign(project, params);
    await project.save();

    return project;
}