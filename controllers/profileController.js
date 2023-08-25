const { Sequelize } = require('sequelize');

const db = require('../db');
const validateRequest = require('../middleware/validate-request');

const User = db.User, Education = db.Education, Research = db.Research, Review = db.Review;

module.exports = {
    getProfile, getResearcher, createEducation, updateEducation, deleteEducation, createResearch, updateResearch, deleteResearch, createReview
};

async function getProfile(req, res, next) {
    if (req.user) {
        try {
            req.user = await getUserByUserId(req.user.id);
            req.user.Education = await User.findAll({
                include: [{
                    model: Education,
                    where: { UserId: req.user.id }
                }]
            });
            req.user.Research = await User.findAll({
                include: [{
                    model: Research,
                    where: { UserId: req.user.id }
                }]
            });
            // console.log(await req.user.getRequestedUsers());
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
        const researcher = await getUserByUserId(id);
        const education = await getEducationsByUserId(id);
        const research = await getResearchesByUserId(id);
        req.researcher = researcher;
        req.researcher.Education = education;
        req.researcher.Research = research;
        const requestedUsers = await req.user.getRequestedUsers();
        req.requestedUser = requestedUsers.some(requestedUser => requestedUser.id === req.researcher.id);
        const requesterUsers = await req.user.getRequesterUsers();
        req.requesterUser = requesterUsers.some(requesterUser => requesterUser.id === req.researcher.id);
        const connections = await req.user.getConnectingUsers();
        req.connectionStatus = connections.some(connection => connection.id === req.researcher.id);
        const review = await getReviewsByRevieweeId(id);
        req.researcher.Review = review;
        const rating = await getRatingByRevieweeId(id);
        req.researcher.Rating = rating;
        req.researcher.RevieweeStatus = review.some(aReview => aReview.reviewerId === req.user.id) || req.user.id === req.researcher.id || !req.connectionStatus;
        next();
    } catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
}

async function getUserByUserId(id) {
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
        where: { UserId: id },
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
        where: { UserId: id },
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

async function createEducation(req, res, next) {
    await Education.create({
        UserId: req.user.id,
        degree: req.body.degree,
        major: req.body.major,
        institute: req.body.institute,
        country: req.body.country,
        fromYear: req.body.fromYear,
        toYear: req.body.toYear
    })
        .then((education) => {
            next();
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
}

async function updateEducation(req, res, next) {
    await Education.upsert({
        id: req.params.eduId,
        UserId: req.user.id,
        degree: req.body.degree,
        major: req.body.major,
        institute: req.body.institute,
        country: req.body.country,
        fromYear: req.body.fromYear,
        toYear: req.body.toYear
    })
        .then((education) => {
            next();
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
}

async function deleteEducation(req, res, next) {
    await Education.destroy({
        where: {
            id: req.params.eduId
        },
    })
        .then((education) => {
            next();
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
}

async function createResearch(req, res, next) {
    await Research.create({
        UserId: req.user.id,
        title: req.body.title,
        year: req.body.year,
        link: req.body.link
    })
        .then((research) => {
            next();
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
}

async function updateResearch(req, res, next) {
    await Research.upsert({
        id: req.params.researchId,
        UserId: req.user.id,
        title: req.body.title,
        year: req.body.year,
        link: req.body.link
    })
        .then((research) => {
            next();
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
}

async function deleteResearch(req, res, next) {
    await Research.destroy({
        where: {
            id: req.params.researchId
        },
    })
        .then((research) => {
            next();
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
}

async function createReview(req, res, next) {
    await Review.create({
        reviewerId: req.user.id,
        revieweeId: req.params.revieweeId,
        rating: req.body.rating,
        review: req.body.review,
    })
        .then((review) => {
            next();
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
}

async function getReviewsByRevieweeId(id) {
    return Review.findAll({
        where: { revieweeId: id },
        include: [
            {
                model: User,
                as: 'reviewerUsers',
                attributes: ['id', 'username']
            },
        ],
        raw: true,
        nest: true,
    })
        .then((review) => {
            return review;
        })
        .catch((err) => {
            console.log(">> Error while finding review: ", err);
        });
}

async function getRatingByRevieweeId(id) {
    return Review.findAll({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating']],
        where: {
            revieweeId: id,
        },
        raw: true,
    })
        .then((review) => {
            return review[0].avgRating;
        })
        .catch((err) => {
            console.log(">> Error while finding review: ", err);
        });
}