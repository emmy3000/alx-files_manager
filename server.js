#!/usr/bin/env node
/**
 * @file server.js
 * @description Entry point for the Express server.
 * It listens on the specified port (or default 5000),
 * loads routes from routes/index.js, and starts the server.
 */

import express from 'express';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
