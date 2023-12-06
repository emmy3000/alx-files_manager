// controllers/FilesController.js
// Handles file upload functionality, creating new files in the database and on disk.
// Validates user authentication, input parameters, and parent file conditions.
// Stores files locally in the specified or default folder path and updates the file document in the database.

import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  // ... (existing methods)

  static async getShow(req, res) {
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

    return res.status(200).json(file);
  }

  static async getIndex(req, res) {
    const { 'x-token': token } = req.headers;
    const { parentId = '0', page = '0' } = req.query;

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const files = await dbClient.getFilesByParentId(userId, parentId, page);
    return res.status(200).json(files);
  }
}

export default FilesController;
