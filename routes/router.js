const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const connectionsRoutes = require("./connectionsRoutes");
const projectsRoutes = require("./projectsRoutes");

router.use('/user', userRoutes);
router.use('/', authRoutes);
router.use('/profile', profileRoutes);
router.use('/connections', connectionsRoutes);
router.use('/projects', projectsRoutes);

module.exports = router;