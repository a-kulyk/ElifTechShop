var router = require('express').Router();

// api router will mount other routers
// for all our resources
router.use('/user', require('./auth/authRoutes'));
// router.use('/order', require('./order/orderRoutes'));
router.use('/catalog',require('./catalog/catalogRoutes'));
module.exports = router;