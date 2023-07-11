const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const JWT_SECRET = process.env.JWT_SECRET;

const validateLogin = () => {
  return [
    body("identifier").notEmpty().withMessage("Login input must not be empty"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const login = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) return res.status(400).json({ error: error.array() });

  const { identifier, password } = req.body;

  const user = users.find(
    (user) =>
      (user.username === identifier ||
        user.email === identifier ||
        user.phone === identifier) &&
      user.password === password
  );

  if (!user) {
    return res
      .status(401)
      .json({ message: "Username/email/phone number is incorrect" });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const session = {
    userId: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    password: hashedPassword,
  };

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).json({ message: "Login success!", token, session });
};

module.exports = { validateLogin, login };
