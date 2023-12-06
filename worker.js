#!/usr/bin/env node
// Background worker script for processing Bull queue jobs.
// Creates a Bull queue named fileQueue for generating thumbnails.
// Processes the queue, generating 3 thumbnails with widths of 500, 250, and 100 pixels.
// Updates the endpoint GET /files/:id/data to accept a query parameter 'size' for serving different thumbnail sizes.

import Bull from 'bull';
import dbClient from './utils/db';

// Create a queue userQueue
const userQueue = new Bull('userQueue');

// Process the userQueue
userQueue.process(async job => {
  const { userId } = job.data;

  // If userId is not present in the job, raise an error Missing userId
  if (!userId) {
    throw new Error('Missing userId');
  }

  // If no document is found in DB based on the userId, raise an error User not found
  const user = await dbClient.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Print in the console Welcome <email>!
  console.log(`Welcome ${user.email}!`);
});

export default userQueue;
