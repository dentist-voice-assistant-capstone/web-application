const express = require('express');
const morgan = require('morgan');

const registerRouter = require('./routes/registerRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/register', registerRouter);

module.exports = app;
