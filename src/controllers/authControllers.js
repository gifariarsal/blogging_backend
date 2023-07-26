const { Op } = require('sequelize')
const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');
const transporter = require('../helpers/transporter');
const path = require('path');
const fs = require('fs').promises;
const handlebars = require('handlebars');
const users = db.user;

const authControllers = {
    register: async (req, res) => {
        const { username, email, phone, password, confirmPassword } = req.body;
        try {
            const data = await users.findOne({
                where: { [Op.or]: [{ username }, { email }, { phone }] },
            });

            if (data) return res.status(500).json({ message: "Username, email, or phone already exists" });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await db.sequelize.transaction(async (t) => {
                const result = await users.create({
                    username,
                    email,
                    phone,
                    password: hashedPassword,
                    isVerified: false
                }, { transaction: t });

                let payload = { id: result.id, email: result.email };

                const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });

                const redirect = `http://localhost:3000/verification/${token}`;

                const data = await fs.readFile(path.resolve(__dirname, "../email/verificationEmail.html"), "utf-8");

                const tempCompile = handlebars.compile(data);
                const tempResult = tempCompile({ username, redirect });

                await transporter.sendMail({ to: result.email, subject: "Verify Account", html: tempResult });

                return res.status(200).json({
                    message: "Register success. Please check your email to verify your account",
                    data: result,
                    token
                });
            });
        } catch(error) {
            return res.status(500).json({ message: "Register failed", error: error.message });
        }
    },

    verifyEmail: async (req, res) => {
        try {
            const { id } = req.user;
            const user = await users.findOne({ where: { id } });
            if (user.dataValues.isVerified) throw new Error("Token already in use");

            await db.sequelize.transaction(async (t) => {
                const updateUser = await users.update(
                    { isVerified: true },
                    { where: { id: id }, transaction: t }
                );
            })

            return res.status(200).json({ message: 'Email is verified successfully' });

        } catch (error) {
            return res.status(500).json({ message: "Failed to verify your email", error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, username, phone, password } = req.body;
            let where = {};
            if (email) { where.email = email; }
            if (username) { where.username = username; }
            if (phone) { where.phone = phone; }

            const checkLogin = await users.findOne({ where });
            if (!checkLogin.isVerified) return res.status(404).json({ message: "Please verify your email" });

            const passwordValid = await bcrypt.compare(password, checkLogin.password);
            if (!passwordValid) return res.status(404).json({ message: "Incorrect password"});

            let payload = {
                id: checkLogin.id,
                username: checkLogin.username,
                email: checkLogin.email,
                phone: checkLogin.phone,
            };

            const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '100h'} );

            return res.status(200).json({ message: "Login success", data: token });
        } catch (error) {
            return res.status(500).json({ message: "Login failed", error: error.message });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const checkEmail = await users.findOne({ where: { email } })

            if (!checkEmail) return res.status(400).json({ message: "Email not found" });
            let payload = {
                id: checkEmail.id,
                username: checkEmail.username,
                email: checkEmail.email,
                phone: checkEmail.phone
            };
            const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '2h' });
            const redirect = `http://localhost:3000/verification/${token}`;

            const data = await fs.readFile(path.resolve(__dirname, "../email/forgotPassword.html"), 'utf-8');
            const tempCompile = handlebars.compile(data);
            const tempResult = tempCompile({ redirect });
            await transporter.sendMail({ to: email, subject: "Forgot Password", html: tempResult });
            return res.status(200).json({ message: "Request accepted. Check your email to reset your password" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to send request" });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { id, email } = req.user;
            const { newPassword, confirmNewPassword } = req.body;
            const user = await users.findOne({ where: { id }});
            if (!user) return res.status(400).json({ message: "Account not found" });
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await db.sequelize.transaction(async (t) => {
                const result = await users.update({
                    password: hashedPassword
                }, { where: { id }, transaction: t });

                const data = await fs.readFile(path.resolve(__dirname, "../email/resetPassword.html"), 'utf-8');
                const tempCompile = handlebars.compile(data);
                const tempResult = tempCompile();
                await transporter.sendMail({ to: email, subject: "Reset Password", html: tempResult });
            });
            return res.status(200).json({ message: "Your password has been reset successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to reset your password", error: error.message });
        };
    }
};

module.exports = authControllers;