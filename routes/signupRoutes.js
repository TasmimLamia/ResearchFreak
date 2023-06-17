import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';

import signupController from '../controllers/signupController.js';

const router = new Router;

router.get('/', asyncHandler(async (req, res) => {
    res.render('signup.ejs');
}));

export default router;