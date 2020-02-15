const express = require('express');
const session = require('express-session');
const server = express();
const userRouter = require('./data/users/user-router.js');
const knexSessionStore = require('connect-session-knex')(session);


const sessionConfig = {
    name: 'FreddieSession',
    secret: 'whattheheck',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true},
    resave: false, 
    saveUninitialized: false,

    store: new knexSessionStore ({
        knex: require('./data/dbConfig.js'),
        tableName: 'sessions',
        sidfieldname: 'sid',
        createTable: true,
        clearInterval: 1000*60*60
    })
    
    }


server.use(express.json());
server.use(session(sessionConfig));
server.use('/api/users', userRouter);


server.get('/api', (req, res) => {
  res.send('api up and running');
});

module.exports = server;
