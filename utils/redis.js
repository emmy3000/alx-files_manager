#!/usr/bin/env node
/**
 * @file Redis utility class for handling Redis connections and operations.
 * @class RedisClient
 * @classdesc
 * The RedisClient class encapsulates methods for interacting with a Redis database,
 * including establishing connections, handling errors, updating connection status,
 * checking connection aliveness, and performing basic Redis operations.
 * @memberof utils
 */

import redis from 'redis';

// Define the RedisClient class
class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = redis.createClient();

    // Display any errors in the console
    this.client.on('error', (err) => {
      console.error(`Redis Client Error: ${err}`);
    });

    // Set a flag to indicate when the connection is established
    this.connected = false;

    // Listen for the ready event to update the flag
    this.client.on('ready', () => {
      this.connected = true;
    });
  }

  // Check if the connection to Redis is alive
  isAlive() {
    return new Promise((resolve) => {
      // Use the ping command to check the connection status
      this.client.ping((err) => {
        resolve(!err);
      });
    });
  }

  // Get the value stored in Redis for a given key
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  // Set a value in Redis for a given key with an expiration duration
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  // Delete a value in Redis for a given key
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;

