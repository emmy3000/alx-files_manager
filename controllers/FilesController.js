#!/usr/bin/env node
// Handle file upload functionality, creating new files in the database and on disk.
// Validates user authentication, input parameters, and parent file conditions.
// Stores files locally in the specified or default folder path and updates the file document in the database.
// Initiates background processing for generating thumbnails for image files.
// Retrieves file data and serves different thumbnail sizes based on user requests.

import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import bull from 'bull';

const fileQueue = new bull('fileQueue');

class FilesController {
  static async postUpload(req, res) {
    const { 'x-token': token } = req.headers;
    const { name, type, parentId = 0, isPublic = false, data } = req.body;

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    if (parentId !== 0) {
      const parentFile = await dbClient.getFile(parentId);
      if (!parentFile || parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const newFile = {
      userId,
      name,
      type,
      isPublic,
      parentId,
    };

    if (type === 'folder') {
      const result = await dbClient.insertFile(newFile);
      return res.status(201).json(result.ops[0]);
    } else {
      const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const filePath = `${folderPath}/${uuidv4()}`;

      fs.writeFileSync(filePath, Buffer.from(data, 'base64'));

      newFile.localPath = filePath;

      const result = await dbClient.insertFile(newFile);

      // Add a job to the fileQueue for thumbnail generation
      fileQueue.add({
        userId,
        fileId: result.ops[0].id,
      });

      return res.status(201).json(result.ops[0]);
    }
  }

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

      await dbClient.updateFileIsPublic(userId, id, true);

      return res.status(200).json(await dbClient.getFileById(userId, id));
    } catch (error) {
      console.error('Error publishing file:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

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

      await dbClient.updateFileIsPublic(userId, id, false);

      return res.status(200).json(await dbClient.getFileById(userId, id));
    } catch (error) {
      console.error('Error unpublishing file:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getFile(req, res) {
    try {
      const { 'x-token': token } = req.headers;
      const { id } = req.params;
      const { size } = req.query;

      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const file = await dbClient.getFileById(userId, id);
      if (!file || (!file.isPublic && file.userId !== userId)) {
        return res.status(404).json({ error: 'Not found' });
      }

      if (file.type === 'folder') {
        return res.status(400).json({ error: "A folder doesn't have content" });
      }

      const thumbnailPath = `/tmp/files_manager/${id}_${size || 'original'}`;
      if (!fs.existsSync(thumbnailPath)) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.sendFile(thumbnailPath);
    } catch (error) {
      console.error('Error getting file data:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default FilesController;
