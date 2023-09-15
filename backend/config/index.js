const dotenv = require('dotenv');
dotenv.config();

exports.config = {
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_DATABASE: process.env.MONGO_DATABASE,
  NODE_PORT: process.env.NODE_PORT,
  MONGO_PORT: process.env.MONGO_PORT,
  PORT: process.env.PORT
};
