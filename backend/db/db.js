// db/db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./store_rating.db');

module.exports = db;
