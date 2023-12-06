#!/usr/bin/env node
/**
 * MongoDB Utilities - Database Client
 *
 * This script defines a MongoDB Database Client class (DBClient) that connects to
 * MongoDB using the provided or default configuration. It includes methods to check
 * the connection status, retrieve the number of documents in the 'users' and 'files'
 * collections, and exports an instance of the DBClient named dbClient.
 *
 * Environment Variables:
 * - DB_HOST: MongoDB host address (default: 'localhost')
 * - DB_PORT: MongoDB port (default: 27017)
 * - DB_DATABASE: MongoDB database name (default: 'files_manager')
 */

import { MongoClient } from 'mongodb';

class DBClient {
  // Constructor sets up the MongoDB client and connects to the database
  constructor() {
    // Extracting configuration from environment variables or using defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    // MongoDB connection URL
    const url

import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const url = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    this.connection = this.client.connect().then(() => {
      console.log('DB connected successfully');
    }).catch((err) => {
      console.error(`DB connection error: ${err}`);
    });
  }

  async isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const usersCollection = this.client.db().collection('users');
    return usersCollection.countDocuments();
  }

  async nbFiles() {
    const filesCollection = this.client.db().collection('files');
    return filesCollection.countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
