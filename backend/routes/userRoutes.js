const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const userController = require('../controllers/userController');

router.use(authenticate, allowRoles('user'));

router.get('/stores', userController.listStores);
router.post('/rating/:storeId', userController.submitRating);

module.exports = router;
