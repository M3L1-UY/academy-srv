const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../envirome/devEnvirome.env"),
});

const dbmongo_host = process.env.DB_MONGO_HOST;
const dbmongo_db = process.env.DB_DATABASE;

//const MONGODB_URL = `mongodb://${dbmongo_host}/${dbmongo_db}`;
const MONGODB_URL  = process.env.DB_MONGO_URI;
const connectWithRetry = () => {
  console.log('Conexión MongoDB con reintento');
  return mongoose.connect(MONGODB_URL, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000, 
  }).catch(err => {
    console.error('ongoose error de conexión:', err);
    setTimeout(connectWithRetry, 5000); 
  });
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado a la BD');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose error de conexión:', err);
  setTimeout(connectWithRetry, 5000); 
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado');
});

connectWithRetry();
