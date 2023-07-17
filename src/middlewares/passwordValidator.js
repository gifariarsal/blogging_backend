const passwordValidator = (req, res, next) => {
    const { password } = req.body;

    const validatePassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{6,}$/;

    if (!validatePassword.test(password))
        return res.status(400).json({
            message: "Password must contain at least 6 characters, 1 symbol, and 1 uppercase"
        });
    next();
};

module.exports = passwordValidator;