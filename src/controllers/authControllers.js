const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');
const user = db.user;

const authControllers = {
    register: async (req, res) => {
        try {
            const { username, email, phone, password } = req.body;

            const emailExists = await user.findOne({
                where: { email }
            });

            if (emailExists) {
                return res.status(500).json({
                    message: 'Email already exists'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await db.sequelize.transaction(async (t) => {
                const result = await user.create({
                    username,
                    email,
                    phone,
                    password: hashedPassword
                }, { transaction: t });
                return res.status(200).json({
                    message: 'Register success',
                    data: result
                });
            });
        } catch(error) {
            return res.status(500).json({
                message: 'Register failed',
                error: error.message
            })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const checkLogin = await user.findOne({
                where: { email }
            });

            const passwordValid = await bcrypt.compare(password, checkLogin.password);
            if (!passwordValid)
                return res.status(404).json({ message: "Password incorrect"});

            let payload = {
                id: checkLogin.id,
                username: checkLogin.username,
                email: checkLogin.email,
                phone: checkLogin.phone,
            }

            const token = jwt.sign(
                payload,
                process.env.JWT_KEY, { expiresIn: '1h'}
            )

            return res.status(200).json({
                message: "Login success",
                data: token
            })
        } catch (error) {
            return res.status(500).json({
              message: "Login failed",
              error: error.message,
            });
        }
    }
};

module.exports = authControllers;