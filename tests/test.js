#!/usr/bin/env node
/*
  This script contains test cases for the API endpoints in the alx-files_manager application.
  It uses the Chai and Chai-HTTP libraries for making HTTP requests and assertions.
  Before running the tests, it clears the Redis cache and sets up or clears the testing database.
  After the tests, it performs cleanup actions, such as closing connections or stopping servers.
*/

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const redisClient = require('../utils/redisClient');
const dbClient = require('../utils/dbClient');

chai.use(chaiHttp);
const { expect } = chai;

describe('API Tests', () => {
  before(async () => {
    await redisClient.flushall();
  });

  after(async () => {
  });

  describe('GET /status', () => {
    it('should return status 200 and a JSON response', async () => {
      const res = await chai.request(app).get('/status');
      expect(res).to.have.status(200);
      expect(res).to.be.json;
    });

    it('should have a property "status" with the value "OK"', async () => {
      const res = await chai.request(app).get('/status');
      expect(res.body).to.have.property('status').that.equals('OK');
    });
  });
});
