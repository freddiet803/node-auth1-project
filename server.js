const express = require('express');
const server = express();
const userRouter = require('./data/users/user-router.js');

server.use(express.json());
server.use('/api/users', userRouter);

server.get('/api', (req, res) => {
  res.send('api up and running');
});

module.exports = server;
