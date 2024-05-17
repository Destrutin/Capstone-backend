"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

// Load environment variables or set default values
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 5000;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USER = process.env.DB_USER;

// Function to get the database URI based on environment
function getDatabaseUri() {
  if (process.env.NODE_ENV === "test") {
    return `postgresql://${DB_USER}:${DB_PASSWORD}@localhost/mealdb_test`;
  } else {
    return (
      process.env.DATABASE_URL ||
      `postgresql://${DB_USER}:${DB_PASSWORD}@localhost/mealdb`
    );
  }
}

// Speed up bcrypt during tests, set appropriate BCRYPT_WORK_FACTOR for different environments
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// Log configuration details
console.log("App Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR:".yellow, BCRYPT_WORK_FACTOR);
console.log("Database URI:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
