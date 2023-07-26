const db = require('../models');
const user = db.user;
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const fs = require('fs').promises;
const transporter = require("../helpers/transporter");
const handlebars = require("handlebars");
const path = require("path");

const profileControllers = {
    changeUsername: async (req, res) => {
        try {
            const { currentUsername, newUsername } = req.body;
            const usernameExists = await user.findOne({ where: { username: currentUsername }});

            if (!usernameExists) return res.status(400).json({ message: "Username not found" });

            await db.sequelize.transaction(async (t) => {
                const result = await user.update(
                  { username: newUsername },
                  { where: { id: req.user.id }, transaction: t }
                );
                const data = await fs.readFile(path.resolve(__dirname, "../email/changeUsername.html"), 'utf-8');
                const tempCompile = handlebars.compile(data);
                const tempResult = tempCompile();
                await transporter.sendMail({ to: req.user.email, subject: "Change Username", html: tempResult });
            });
            res.status(200).json({ message: "Username changed successfully" });
        } catch (error) {
            res.status(500).json({ message: "Failed to change username", error: error.message });
        }
    },

    changeEmail: async (req, res) => {
        try {
            const { currentEmail, newEmail } = req.body;
            const emailExists = await user.findOne({ where: { email: currentEmail }});
            if (!emailExists) return res.status(400).json({ message: "Email not found" });

            await db.sequelize.transaction(async (t) => {
                const result = await user.update(
                  { email: newEmail, isVerified: false },
                  { where: { id: req.user.id }, transaction: t }
                );
                let payload = { id: req.user.id, email: newEmail };
                const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });
                const redirect = `http://localhost:3000/verification/${token}`;

                const data = await fs.readFile(path.resolve(__dirname, "../email/changeEmail.html"), 'utf-8');
                const tempCompile = handlebars.compile(data);
                const tempResult = tempCompile({ redirect });
                await transporter.sendMail({ to: newEmail, subject: "Change Email", html: tempResult });
            });
            res.status(200).json({ message: "Email changed successfully. Check your email to verify." });
        } catch (error) {
            res.status(500).json({ message: "Failed to change email", error: error.message });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const { id } = req.user;
            const users = await user.findOne({ where: { id } });
            const checkPassword = await bcrypt.compare(oldPassword, users.password);
            if (!checkPassword) return res.status(400).json ({ message: "Incorrect password" });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await db.sequelize.transaction(async (t) => {
                const update = await user.update(
                    { password: hashedPassword },
                    { where: { id }, transaction: t }
                );
                const data = await fs.readFile(path.resolve(__dirname, "../email/changePassword.html"), 'utf-8');
                const tempCompile = handlebars.compile(data);
                const tempResult = tempCompile();
                await transporter.sendMail({ to: req.user.email, subject: "Change Password", html: tempResult });
            });
            res.status(200).json({ message: "Password changed successfully" });
        } catch (error) {
            res.status(500).json({ message: "Failed to change password", error: error.message });
        }
    },

    changePhone: async (req, res) => {
        try {
            const { currentPhone, newPhone } = req.body;
            const phoneExists = await user.findOne({ where: { phone: currentPhone }});

            if (!phoneExists) return res.status(400).json({ message: "Phone not found" });

            await db.sequelize.transaction(async (t) => {
                const resul = await user.update(
                    { phone: newPhone },
                    { where: { id: req.user.id }, transaction: t }
                );
                const data = await fs.readFile(path.resolve(__dirname, "../email/changePhone.html"), 'utf-8');
                const tempCompile = handlebars.compile(data);
                const tempResult = tempCompile();
                await transporter.sendMail({ to: req.user.email, subject: "Change Phone", html: tempResult });
            });
            res.status(200).json({ message: "Phone number changed successfully" });
        } catch (error) {
            res.status(500).json({ message: "Failed to change phone number", error: error.message });
        }
    },

    changeAvatar: async (req, res) => {
        try {
            const { id } = req.user;
            const oldAvatar = await user.findOne({ where: { id } });

            if (oldAvatar.imgProfile) {
                fs.unlink(oldAvatar.imgProfile, (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                });
            }

            await db.sequelize.transaction(async (t) => {
                const result = await user.update(
                  { imgProfile: req.file.path },
                  { where: { id } },
                  { transaction: t }
                );
            });
            res.status(200).json({ message: "Avatar changed successfully" });
        } catch (error) {
            res.status(500).json({ message: "Failed to change avatar", error: error.message });
        }
    },
}

module.exports = profileControllers;