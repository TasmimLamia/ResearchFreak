import express, { Router } from 'express';

import userRoutes from './userRoutes.js';
import signinRoutes from './signinRoutes.js';
import signupRoutes from './signupRoutes.js';


const router = new Router;

router.use('/user', userRoutes);
router.use('/signin', signinRoutes);
router.use('/signup', signupRoutes);

export default router;