const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const storeOwnerController = require('../controllers/storeOwnerController');

router.use(authenticate, allowRoles('store_owner'));

router.get('/raters', storeOwnerController.getRaters);
router.get('/average-rating', storeOwnerController.getAverageRating);

module.exports = router;
