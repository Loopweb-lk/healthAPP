const express = require('express');
const { register, login, logout, passwordRest, refreshToken } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login a user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 token:
 *                   type: string
 *                   example: "A1122XXXXXXXXXXXXXXXX"
 */

router.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Signout a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/auth/password-rest:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset a password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset code sent successfully
 */
router.post('/password-rest', passwordRest);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh the token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refresh successful
 */
router.post('/refresh-token', refreshToken);

module.exports = router;

// utils/responseHandler.js
exports.successResponse = (res, message, data) => {
    res.status(200).json({ message, data });
};

exports.errorResponse = (res, error) => {
    res.status(500).json({ error });
};