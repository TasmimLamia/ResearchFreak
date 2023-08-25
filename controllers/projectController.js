const express = require('express');
const Joi = require('joi');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

const db = require('../db');
const validateRequest = require('../middleware/validate-request');

const User = db.User, Project = db.Project, UserProject = db.UserProject;

module.exports = {
    getProject, getProjectList, createProject, updateProject, addContributor, removeContributor
};

async function getProject(req, res, next) {
    if (req.params.projectId) {
        try {
            const project = await Project.findByPk(req.params.projectId);
            if (!project) {
                res.sendStatus(404);
            };
            const contributorList = await getContributorsByProjeectId(req.params.projectId);
            req.project = project;
            req.project.ContributorList = contributorList;
            req.project.PotentialContributor = await getAddContributors(req.user.id, req.params.projectId);
            const nonPotentialContributors = await project.getUsers();
            const findUserIndex = nonPotentialContributors.findIndex(a => a.id === req.user.id)
            findUserIndex !== -1 && nonPotentialContributors.splice(findUserIndex, 1)
            req.project.NonPotentialContributor = nonPotentialContributors;
            next();
        } catch (e) {
            console.log(e);
            res.sendStatus(404);
        }
    }
}

async function createProject(req, res, next) {
    if (req.user) {
        await Project
            .create(req.body)
            .then(async (project) => {
                await UserProject
                    .create({ userId: req.user.id, projectId: project.id })
                    .then((userProject) => {
                        next();
                    })
                    .catch((e) => {
                        console.log(e);
                        res.sendStatus(400);
                    });
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    }
}

async function getContributorsByProjeectId(projectId) {
    return (await UserProject.findAll({
        attributes: [],
        include: [
            {
                model: User,
                as: 'Users',
            },
        ],
        where: {
            projectId: projectId,
        },
        raw: true,
        nest: true,
    })).map(x => x.Users)
}

async function getProjectList(req, res, next) {
    if (req.user) {
        try {
            const projectList = await getProjectsById(req.user.id);
            req.user.ProjectList = projectList;
            next();
        } catch (e) {
            console.log(e);
            res.sendStatus(404);
        }
    }
}

async function getProjectsById(userId) {
    const projects = (await UserProject.findAll({
        attributes: [],
        include: [
            {
                model: Project,
                as: 'Projects',
                include: [
                    {
                        model: User,
                        as: 'Users',
                        attributes: ['id', 'username'],
                        where: {
                            id: userId,
                        }
                    },
                ],
            },
        ],
        where: {
            userId: userId,
        },
        raw: true,
        nest: true,
    })).map(x => x.Projects);
    return projects;
}

function updateProject(req, res, next) {
    update(req.params.projectId, req.body)
        .then(user => res.redirect("/projects/" + req.params.projectId))
        .catch(next);
}

async function update(id, params) {
    const project = await db.Project.findByPk(id);

    Object.assign(project, params);
    await project.save();

    return project;
}

async function getAddContributors(userId, projectId) {
    const user = await User.findOne({
        where: { id: userId }
    });
    const connections = await user.getConnectingUsers();
    const contributorList = await getContributorsByProjeectId(projectId);
    return connections.filter(({ id: id1 }) => !contributorList.some(({ id: id2 }) => id2 === id1));
}

async function addContributor(req, res, next) {
    const project = await Project.findOne({
        where: { id: req.params.projectId }
    });
    await project.addUsers(await User.findOne({
        where: { id: req.params.userId }
    }));
    next();
}

async function removeContributor(req, res, next) {
    const project = await Project.findOne({
        where: { id: req.params.projectId }
    });
    await project.removeUsers(await User.findOne({
        where: { id: req.params.userId }
    }));
    next();
}