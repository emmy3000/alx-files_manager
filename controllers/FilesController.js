// controllers/FilesController.js
// Handles file upload functionality, creating new files in the database and on disk.
// Validates user authentication, input parameters, and parent file conditions.
// Stores files locally in the specified or default folder path and updates the file document in the database.

import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

class FilesController {
  static async postUpload(req, res) {
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
  }
}

export default FilesController;
