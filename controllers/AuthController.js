#!/usr/bin/env node

import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * @file controllers/AuthController.js
 * @description Controller handling user authentication endpoints.
 * Contains methods for user sign-in (GET /connect) and sign-out (GET /disconnect) operations.
 */
class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authHeader.substring('Basic '.length);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');

    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.getUser(email);

    if (!user || user.password !== pwdHashed(password)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    
    await redisClient.set(key, user._id.toString(), 24 * 60 * 60);

    return res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const { 'x-token': token } = req.headers;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await redisClient.del(`auth_${token}`);

    return res.status(204).send();
  }
}

export default AuthController;

