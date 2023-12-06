#!/usr/bin/env node
/**
 * @file controllers/AppController.js
 * @description Defines the endpoints' functionality for the API.
 * Contains logic for GET /status and GET /stats.
 */

import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AppController = {
  async getStatus(req, res) {
    const redisStatus = await redisClient.isAlive();
    const dbStatus = await dbClient.isAlive();

    const status = {
      redis: redisStatus,
      db: dbStatus,
    };

    return res.status(200).json(status);
  },

  async getStats(req, res) {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();

    const stats = {
      users: usersCount,
      files: filesCount,
    };

    return res.status(200).json(stats);
  },
};

export default AppController;
