const db = require('./db');
const bcrypt = require('bcryptjs');

// Pre-hash passwords
const hash = (pwd) => bcrypt.hashSync(pwd, 10);

db.serialize(() => {
  // Clear old data
  db.run('DELETE FROM ratings');
  db.run('DELETE FROM stores');
  db.run('DELETE FROM users');

  // Insert users
  const users = [
    ['Admin', 'admin@example.com', hash('Admin@123'), 'Admin Address', 'admin'],
    ['User', 'user@example.com', hash('User@123'), 'User Address', 'user'],
    ['Owner', 'owner@example.com', hash('Owner@123'), 'Store Owner Address', 'store_owner']
  ];

  const insertUser = db.prepare('INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)');
  users.forEach(user => insertUser.run(...user));
  insertUser.finalize();

  // Insert store (owned by Owner One, user ID 4)
  db.run(`INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
    ['TechMart', 'techmart@example.com', '123 Tech Street', 3]);

  // Insert ratings
  db.run(`INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`, [2, 1, 5]);

  console.log('✅ Dummy data inserted successfully.');
});
