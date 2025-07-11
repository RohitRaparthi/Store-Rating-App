const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret';

exports.register = (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [name, email, hashedPassword, address, role], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Email already exists or DB error', error: err.message });
    }
    res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  });
};

exports.updatePassword = (req, res) => {
  const userId = req.user.userId;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old and new password required' });
  }

  db.get(`SELECT password FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err || !user) return res.status(404).json({ message: 'User not found' });

    const isValid = bcrypt.compareSync(oldPassword, user.password);
    if (!isValid) return res.status(401).json({ message: 'Incorrect old password' });

    const newHashed = bcrypt.hashSync(newPassword, 10);
    db.run(`UPDATE users SET password = ? WHERE id = ?`, [newHashed, userId], (err) => {
      if (err) return res.status(500).json({ message: 'Password update failed' });
      res.json({ message: 'Password updated successfully' });
    });
  });
};
