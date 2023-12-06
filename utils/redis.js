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
    return this.connected;
  }

  // Get the value stored in Redis for a given key
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return getAsync(key);
  }

  // Set a value in Redis for a given key with an expiration duration
  async set(key, value, duration) {
    this.client.set(key, value);
    this.client.expire(key, duration);
  }

  // Delete a value in Redis for a given key
  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;

