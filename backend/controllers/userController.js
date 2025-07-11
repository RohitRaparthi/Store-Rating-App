const db = require('../db/db');

// List/Search Stores with overall & user-specific rating
exports.listStores = (req, res) => {
  const { name = '', address = '' } = req.query;
  const userId = req.user.userId;

  const query = `
    SELECT 
      s.id, s.name, s.address,
      IFNULL(ROUND(AVG(r.rating), 2), 0) AS overall_rating,
      (
        SELECT rating FROM ratings 
        WHERE user_id = ? AND store_id = s.id
      ) AS user_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE s.name LIKE ? AND s.address LIKE ?
    GROUP BY s.id
  `;

  db.all(query, [userId, `%${name}%`, `%${address}%`], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching stores', error: err.message });
    res.json(rows);
  });
};

// Submit new rating
exports.submitRating = (req, res) => {
  const userId = req.user.userId;
  const storeId = req.params.storeId;
  const { rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const query = `
    INSERT INTO ratings (user_id, store_id, rating)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, store_id) DO UPDATE SET 
      rating = excluded.rating,
      updated_at = CURRENT_TIMESTAMP
  `;

  db.run(query, [userId, storeId, rating], function (err) {
    if (err) return res.status(500).json({ message: 'Failed to submit rating', error: err.message });
    res.json({ message: 'Rating submitted/updated successfully' });
  });
};
