// db/init.js
const db = require('./db');
const bcrypt = require('bcryptjs');

// Helper function to hash passwords
const hash = (pwd) => bcrypt.hashSync(pwd, 10);

db.serialize(() => {
  // =======================
  // 1️⃣ Create Tables
  // =======================
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

  console.log('✅ Tables created successfully.');

  // =======================
  // 2️⃣ Clear old data
  // =======================
  db.run('DELETE FROM ratings');
  db.run('DELETE FROM stores');
  db.run('DELETE FROM users');

  // =======================
  // 3️⃣ Insert Dummy Users
  // =======================
  const users = [
    ['Admin', 'admin@example.com', hash('Admin@123'), 'Admin Address', 'admin'],
    ['User', 'user@example.com', hash('User@123'), 'User Address', 'user'],
    ['Owner', 'owner@example.com', hash('Owner@123'), 'Store Owner Address', 'store_owner']
  ];

  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)'
  );
  users.forEach(user => insertUser.run(...user));
  insertUser.finalize();

  console.log('✅ Dummy users inserted successfully.');

  // =======================
  // 4️⃣ Insert Dummy Store
  // =======================
  // Owner has user_id = 3
  db.run(
    `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
    ['TechMart', 'techmart@example.com', '123 Tech Street', 3],
    function(err) {
      if (!err) console.log('✅ Dummy store inserted successfully.');

      // =======================
      // 5️⃣ Insert Dummy Ratings
      // =======================
      // User with id=2 rates store with id=1
      db.run(
        `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`,
        [2, 1, 5],
        function(err) {
          if (!err) console.log('✅ Dummy rating inserted successfully.');
          console.log('🎉 Database initialization complete!');
        }
      );
    }
  );
});
