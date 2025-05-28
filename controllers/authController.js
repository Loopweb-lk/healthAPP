const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');

exports.register = async (req, res) => {
    const { username, email, password, type, CIG, CBG } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create(username, email, hashedPassword, type, CBG, CIG);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findByUsername(username);

        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.logout = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Token required for sign out' });
    res.status(200).json({ message: 'Successfully signed out' });
};

exports.passwordRest = async (req, res) => {
    const { password, token } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const tokenData = await PasswordReset.findByToken(token)
        if (tokenData.length == 0) {
            res.status(400).json({ message: 'Invalid token' });
        } else {
            const userData = await User.changePassword(tokenData[0].email, hashedPassword);
            res.json({ message: 'Reset successful' });
        }



    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.refreshToken = async (req, res) => {
    res.status(200).json({ message: 'Successfully signed out' });
};