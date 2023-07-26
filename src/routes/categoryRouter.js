const router = require('express').Router();

const { categoryControllers } = require('../controllers');

router.get('/category', categoryControllers.getCategory);

module.exports = router;