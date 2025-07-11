const db = require('../db/db');
const bcrypt = require('bcryptjs');

// Add new user
exports.addUser = (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [name, email, hashedPassword, address, role], function (err) {
    if (err) {
      return res.status(500).json({ message: 'User creation failed', error: err.message });
    }
    res.status(201).json({ message: 'User created successfully', id: userId });
  });
};

// Add new store
exports.addStore = (req, res) => {
  const { name, email, address, owner_id } = req.body;

  if (!name || !owner_id) {
    return res.status(400).json({ message: 'Name and owner_id are required' });
  }

  const query = `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`;

  db.run(query, [name, email, address, owner_id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Store creation failed', error: err.message });
    }
    res.status(201).json({ message: 'Store created', storeId: this.lastID });
  });
};

// Get dashboard stats
exports.getStats = (req, res) => {
  const stats = {};
  db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
    stats.totalUsers = row.count;
    db.get(`SELECT COUNT(*) as count FROM stores`, (err, row) => {
      stats.totalStores = row.count;
      db.get(`SELECT COUNT(*) as count FROM ratings`, (err, row) => {
        stats.totalRatings = row.count;
        res.json(stats);
      });
    });
  });
};

// List users with filters
exports.listUsers = (req, res) => {
  const { name = '', email = '', address = '', role = '' } = req.query;
  const query = `
    SELECT id, name, email, address, role
    FROM users
    WHERE name LIKE ? AND email LIKE ? AND address LIKE ? AND role LIKE ?
  `;
  const values = [`%${name}%`, `%${email}%`, `%${address}%`, `%${role}%`];
  db.all(query, values, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching users', error: err.message });
    res.json(rows);
  });
};

// List stores with filters and average ratings
exports.listStores = (req, res) => {
  const { name = '', email = '', address = '' } = req.query;
  const query = `
    SELECT 
      s.id, s.name, s.email, s.address,
      IFNULL(ROUND(AVG(r.rating), 2), 0) as rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE s.name LIKE ? AND s.email LIKE ? AND s.address LIKE ?
    GROUP BY s.id
  `;
  const values = [`%${name}%`, `%${email}%`, `%${address}%`];
  db.all(query, values, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching stores', error: err.message });
    res.json(rows);
  });
};
