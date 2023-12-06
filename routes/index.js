#!/usr/bin/env node
/**
 * @file routes/index.js
 * @description Defines all endpoints for the API.
 * Contains routes such as GET /status, GET /stats, GET /connect, GET /disconnect, and GET /users/me.
 */

import express from 'express';
import FilesController from '../controllers/FilesController';

const router = express.Router();

router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);

router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);

// New endpoint to get file data
router.get('/files/:id/data', FilesController.getFile);

export default router;
