const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../envirome/devEnvirome.env"),
});
let port = "";
let host = "";
let user = "";
let password = "";
let database = "";

console.log("Ejecutandose en .:", process.env.NODE_ENV);
if (process.env.NODE_ENV === "Desarrollo") {
  port = process.env.DB_PORT;
  host = process.env.DB_HOST;
  user = process.env.DB_USER;
  password = process.env.DB_PASSWORD;
  database = process.env.DB_DATABASE;
}

if (process.env.NODE_ENV === "Produccion") {
  port = process.env.DB_PORT_PROD;
  host = process.env.DB_HOST_PROD;
  user = process.env.DB_USER_PROD;
  password = process.env.DB_PASSWORD_PROD;
  database = process.env.DB_DATABASE_PROD;
}

const dialect = "mysql";

const pool = {
  max: 30,
  min: 0,
};

module.exports = {
  port,
  host,
  user,
  password,
  database,
  dialect,
  pool,
};
