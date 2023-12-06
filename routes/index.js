#!/usr/bin/env node
/**
 * @file routes/index.js
 * @description Defines all endpoints for the API.
 * Contains routes such as GET /status and GET /stats.
 */

import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

export default router;
