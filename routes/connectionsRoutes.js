import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';

import authController from '../controllers/authController.js';

const router = new Router;

router.get('/', asyncHandler(async (req, res) => {
    res.render('connections.ejs');
}));

export default router;