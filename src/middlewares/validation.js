const { body, validationResult } = require("express-validator");

const validateLogin = [
  body("username")
    .if(body("username").exists())
    .exists()
    .notEmpty()
    .withMessage("Username is required"),
  body("email")
    .if(body("email").exists())
    .exists()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("phone")
    .if(body("phone").exists())
    .exists()
    .notEmpty()
    .withMessage("Phone is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateRegister = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("phone")
    .if(body("phone").exists())
    .exists()
    .withMessage("Phone is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{6,}$/)
    .withMessage(
      "Password must be at least 6 characters, 1 symbol, and 1 uppercase"
    ),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match");
      }
      return true;
    }),
];

const validateChangeUsername = [
  body("currentUsername")
    .notEmpty()
    .withMessage("Current username is required"),
  body("newUsername").notEmpty().withMessage("New username is required"),
];

const validateChangePhone = [
  body("currentPhone").notEmpty().withMessage("Current phone is required"),
  body("newPhone")
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 7, max: 15 })
    .withMessage("Phone number must be between 7 and 15"),
];

const validateChangeEmail = [
  body("currentEmail")
    .notEmpty()
    .withMessage("Current email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("newEmail")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
];

const validateChangePassword = [
  body("oldPassword").notEmpty().withMessage("Password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{6,}$/)
    .withMessage(
      "Password must be at least 6 characters, 1 symbol, and 1 uppercase"
    ),
  body("confirmNewPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords must match");
      }
      return true;
    }),
];

const validateForgotPassword = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
];

const validateResetPassword = [
  body("newPassword")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{6,}$/)
    .withMessage(
      "Password must be at least 6 characters, 1 symbol, and 1 uppercase"
    ),
  body("confirmNewPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords must match");
      }
      return true;
    }),
];

const validate = (req, res, next) => {
  const { errors } = validationResult(req);

  if (errors.length > 0) return res.status(400).json({ message: errors });

  next();
};

module.exports = {
  validateLogin,
  validateRegister,
  validateChangeUsername,
  validateChangePhone,
  validateChangeEmail,
  validateChangePassword,
  validateResetPassword,
  validateForgotPassword,
  validate,
};