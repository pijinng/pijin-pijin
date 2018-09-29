const mongoose = require('mongoose');
const schemas = require('../models');
require('dotenv').config();

const MONGO_CONFIG = {
  keepAlive: true,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 0,
  useNewUrlParser: true,
};

const connection = {};
connection.db = mongoose.createConnection(process.env.MONGO_URL, MONGO_CONFIG, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.info(`Mongo DB connection started on ${process.env.MONGO_URL}`);
});

connection.models = {};
connection.models.user = connection.db.model('User', schemas.UserSchema);
connection.models.entry = connection.db.model('Entry', schemas.EntrySchema);
connection.models.vote = connection.db.model('Vote', schemas.VoteSchema);

module.exports = connection;
