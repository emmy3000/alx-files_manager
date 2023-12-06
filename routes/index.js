#!/usr/bin/env node
/**
 * @file routes/index.js
 * @description Defines all endpoints for the API.
 * Contains routes such as GET /status, GET /stats, GET /connect, GET /disconnect, and GET /users/me.
 */

import express from 'express';
import AppController from '../controllers/AppController';
import FilesController from '../controllers/FilesController';

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/files', FilesController.postUpload);

export default router;
