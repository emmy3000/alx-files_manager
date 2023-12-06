#!/usr/bin/env node

import dbClient from '../utils/db';

/**
 * @file controllers/UsersController.js
 * @description Controller handling user-related endpoints.
 * Contains methods for retrieving user details (GET /users/me) based on authentication token.
 */
class UsersController {
  static async getMe(req, res) {
    const { 'x-token': token } = req.headers;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.getUserById(userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ id: user._id.toString(), email: user.email });
  }
}

export default UsersController;
