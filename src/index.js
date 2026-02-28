require('dotenv').config();
const { startServer } = require('./server');
const { startBot } = require('./bot');

startServer();
startBot();
