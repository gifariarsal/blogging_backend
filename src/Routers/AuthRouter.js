const express = require("express");

const { validateLogin, login } = require("../Controllers/Login");
const { validateRegister, register } = require("../Controllers/Register");

const router = express.Router();
router.use(express.json());

