const express = require("express");
const router = express.Router();
const { authControllers } = require('../controllers');
const passwordValidator = require('../middlewares/passwordValidator');

router.post('/register', passwordValidator, authControllers.register);
router.post('/login', authControllers.login);

module.exports = router;
