const fs = require("fs");
const https = require("https");
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  console.log(err.stack);
  process.exit(1);
});

dotenv.config();
const app = require('./app');

// Connect MongoDB
const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connection successful!');
  });

const port = process.env.PORT || 3000;
// const server = app.listen(port, () => {});
const server = https
.createServer(
  {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  },
  app
)
.listen(port, () => {
  console.log(`server is runing at port ${port}`)
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
