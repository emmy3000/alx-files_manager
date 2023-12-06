#!/usr/bin/env node
// Background worker script for processing Bull queue jobs.
// Creates a Bull queue named fileQueue for generating thumbnails.
// Processes the queue, generating 3 thumbnails with widths of 500, 250, and 100 pixels.
// Updates the endpoint GET /files/:id/data to accept a query parameter 'size' for serving different thumbnail sizes.

import bull from 'bull';
import dbClient from './utils/db';
import thumbnail from 'image-thumbnail';

const fileQueue = new bull('fileQueue');

fileQueue.process(async (job) => {
  try {
    const { userId, fileId } = job.data;

    if (!fileId) {
      throw new Error('Missing fileId');
    }

    if (!userId) {
      throw new Error('Missing userId');
    }

    const file = await dbClient.getFileById(userId, fileId);

    if (!file) {
      throw new Error('File not found');
    }

    const imagePath = file.localPath;
    const imageBuffer = fs.readFileSync(imagePath);

    const sizes = [500, 250, 100];
    sizes.forEach((size) => {
      const thumbnailPath = `/tmp/files_manager/${fileId}_${size}`;
      thumbnail(imageBuffer, { width: size, height: size }).then((thumbnailBuffer) => {
        fs.writeFileSync(thumbnailPath, thumbnailBuffer);
      });
    });

    return true;
  } catch (error) {
    console.error('Error processing fileQueue job:', error.message);
    throw error;
  }
});
