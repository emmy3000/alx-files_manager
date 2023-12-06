#!/usr/bin/env node
/**
 * @file routes/index.js
 * @description Defines all endpoints for the API.
 * Contains routes such as GET /status, GET /stats, and POST /users.
 */

import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const router = express.Router();

// Existing routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// New user creation route
router.post('/users', UsersController.postNew);

export default router;
