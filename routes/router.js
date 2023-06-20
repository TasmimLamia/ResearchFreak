import express, { Router } from 'express';

import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';


const router = new Router;

router.use('/user', userRoutes);
router.use('/signinup', authRoutes);
router.use('/profile', profileRoutes);

export default router;