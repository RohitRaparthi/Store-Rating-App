const db = require('../db/db');

// Get list of users who rated this owner's store
exports.getRaters = (req, res) => {
  const ownerId = req.user.userId;

  const query = `
    SELECT u.id AS user_id, u.name, u.email, r.rating, r.created_at
    FROM ratings r
    JOIN users u ON r.user_id = u.id
    JOIN stores s ON s.id = r.store_id
    WHERE s.owner_id = ?
    ORDER BY r.created_at DESC
  `;

  db.all(query, [ownerId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching raters', error: err.message });
    res.json(rows);
  });
};

// Get average rating of store owned by this user
exports.getAverageRating = (req, res) => {
  const ownerId = req.user.userId;

  const query = `
    SELECT ROUND(AVG(r.rating), 2) AS average_rating
    FROM ratings r
    JOIN stores s ON s.id = r.store_id
    WHERE s.owner_id = ?
  `;

  db.get(query, [ownerId], (err, row) => {
    if (err) return res.status(500).json({ message: 'Error fetching average rating', error: err.message });
    res.json({ average_rating: row?.average_rating || 0 });
  });
};
