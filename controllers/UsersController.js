#!/usr/bin/env node
/**
 * @file controllers/UsersController.js
 * @description Defines the UsersController class responsible for handling user-related operations.
 * Contains the postNew method, which creates a new user by validating email and password,
 * checking for existing users, hashing the password, and responding with the new user's ID and email.
 */

import dbClient from '../utils/db';
import { pwdHashed } from '../utils/utils';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const existingUser = await dbClient.getUser(email);

    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = pwdHashed(password);

    const newUser = {
      email,
      password: hashedPassword,
    };

    const result = await dbClient.insertUser(newUser);

    return res.status(201).json({ id: result.insertedId, email });
  }
}

export default UsersController;
