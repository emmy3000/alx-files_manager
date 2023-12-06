#!/usr/bin/env node
// controllers/FilesController.js
// Handles file-related functionalities, including upload, publishing, and unpublishing.
// Validates user authentication, input parameters, and file conditions.
// Stores files locally and updates the file document in the database.

import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

class FilesController {
  /**
   * Handles file upload functionality, creating new files in the database and on disk.
   * Validates user authentication, input parameters, and parent file conditions.
   * Stores files locally in the specified or default folder path and updates the file document in the database.
   */
  static async postUpload(req, res) {
    try {
      const { 'x-token': token } = req.headers;
      const { name, type, parentId = 0, isPublic = false, data } = req.body;

      // Retrieve the user based on the token
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Validate inputs
      if (!name) {
        return res.status(400).json({ error: 'Missing name' });
      }

      if (!type || !['folder', 'file', 'image'].includes(type)) {
        return res.status(400).json({ error: 'Missing type' });
      }

      if (type !== 'folder' && !data) {
        return res.status(400).json({ error: 'Missing data' });
      }

      // Check parentId
      if (parentId !== 0) {
        const parentFile = await dbClient.getFile(parentId);
        if (!parentFile || parentFile.type !== 'folder') {
          return res.status(400).json({ error: 'Parent is not a folder' });
        }
      }

      // Create file document
      const newFile = {
        userId,
        name,
        type,
        isPublic,
        parentId,
      };

      if (type === 'folder') {
        // If it's a folder, add the new file document in the DB and return it
        const result = await dbClient.insertFile(newFile);
        return res.status(201).json(result.ops[0]);
      } else {
        // If it's a file or image, store it locally
        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        const filePath = `${folderPath}/${uuidv4()}`;

        fs.writeFileSync(filePath, Buffer.from(data, 'base64'));

        // Add localPath to newFile
        newFile.localPath = filePath;

        // Add the new file document in the collection files
        const result = await dbClient.insertFile(newFile);
        return res.status(201).json(result.ops[0]);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Sets isPublic to true on the file document based on the ID.
   * Retrieves the user based on the token, checks file existence, updates isPublic to true, and returns the updated file document.
   */
  static async putPublish(req, res) {
    try {
      const { 'x-token': token } = req.headers;
      const { id } = req.params;

      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const file = await dbClient.getFileById(userId, id);
      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      // Update isPublic to true
      await dbClient.updateFileIsPublic(userId, id, true);

      // Return the updated file document
      return res.status(200).json(await dbClient.getFileById(userId, id));
    } catch (error) {
      console.error('Error publishing file:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Sets isPublic to false on the file document based on the ID.
   * Retrieves the user based on the token, checks file existence, updates isPublic to false, and returns the updated file document.
   */
  static async putUnpublish(req, res) {
    try {
      const { 'x-token': token } = req.headers;
      const { id } = req.params;

      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const file = await dbClient.getFileById(userId, id);
      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      // Update isPublic to false
      await dbClient.updateFileIsPublic(userId, id, false);

      // Return the updated file document
      return res.status(200).json(await dbClient.getFileById(userId, id));
    } catch (error) {
      console.error('Error unpublishing file:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default FilesController;
