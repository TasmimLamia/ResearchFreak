import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';

import signinController from '../controllers/signinController.js';

const router = new Router;

router.get('/', asyncHandler(async (req, res) => {
    res.render('signin.ejs');
}));

export default router;