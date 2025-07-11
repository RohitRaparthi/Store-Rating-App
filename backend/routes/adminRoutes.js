const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

// Protect this route to admins only
router.get('/overview', authenticate, allowRoles('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});


router.use(authenticate, allowRoles('admin'));

router.post('/add-user', adminController.addUser);
router.post('/add-store', adminController.addStore);
router.get('/stats', adminController.getStats);
router.get('/users', adminController.listUsers);
router.get('/stores', adminController.listStores);

module.exports = router;
