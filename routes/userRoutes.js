import express, { Router } from 'express';

import userController from '../controllers/userController.js';

const router = new Router;

router.get('/', userController);

export default router;