import express, { Router } from 'express';

import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';


const router = new Router;

router.use('/user', userRoutes);
router.use('/signinup', authRoutes);

export default router;