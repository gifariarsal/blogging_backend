const express = require("express");
const router = express.Router();
const { authControllers } = require('../controllers');
const { verifyToken, validateLogin, validateRegister, validate, validateResetPassword, validateForgotPassword } = require('../middlewares');

router.post("/auth/register", validateRegister, validate, authControllers.register);
router.patch("/auth/verification", verifyToken, authControllers.verifyEmail);
router.put("/auth/forgot-password", validateForgotPassword, validate, authControllers.forgotPassword);
router.patch("/auth/reset-password", verifyToken, validateResetPassword, validate, authControllers.resetPassword);
router.post("/auth/login", validateLogin, validate, authControllers.login);

module.exports = router;