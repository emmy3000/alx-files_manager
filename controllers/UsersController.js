#!/usr/bin/env node
/**
 * @file controllers/UsersController.js
 * @description Controller handling user-related endpoints.
 * Contains methods for retrieving user details (GET /users/me) based on authentication token.
 */

// controllers/UsersController.js

import dbClient from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import userQueue from '../worker';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Validate inputs
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists
    const userExists = await dbClient.getUser(email);
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const newUser = {
      email,
      password: hashedPassword,
    };

    // Add the new user document in the DB
    const result = await dbClient.insertUser(newUser);

    // Add a job to the userQueue with the userId
    await userQueue.add({ userId: result.ops[0]._id });

    // Return the new user document
    return res.status(201).json(result.ops[0]);
  }
}

export default UsersController;
