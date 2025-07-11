// db/init.js
const db = require('./db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      address TEXT,
      role TEXT CHECK(role IN ('admin', 'user', 'store_owner')) NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      address TEXT,
      owner_id INTEGER,
      FOREIGN KEY(owner_id) REFERENCES users(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      store_id INTEGER,
      rating INTEGER CHECK(rating BETWEEN 1 AND 5),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(store_id) REFERENCES stores(id),
      UNIQUE(user_id, store_id)
    );
  `);

  console.log('Database initialized!');
});
