const express = require('express');
const pg = require('./db/connect');
const userRouter = require('./routes/userRoutes.js');
const cookieSession = require('cookie-session');


const server = express();

server.use(express.json());

// DB
server.set('db', pg);

// Cookie
server.use(cookieSession({
  name: 'session',
  keys: ['123465'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))



// Routers
server.use('/api', userRouter);

module.exports = server;