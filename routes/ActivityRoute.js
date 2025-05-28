const express = require('express');
const { createActivity } = require('../controllers/ActivityController')
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/activity/createActivity:
 *   post:
 *     tags:
 *       - Activity
 *     summary: Create a new activity log
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Activity details to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activity:
 *                 type: string
 *                 example: Running
 *               timePeriod:
 *                 type: string
 *                 example: 30 minutes
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               burnedCal:
 *                 type: number
 *                 example: 250
 *             required:
 *               - activity
 *               - timePeriod
 *               - timestamp
 *               - burnedCal
 *     responses:
 *       201:
 *         description: Activity Log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Activity Log created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/createActivity', authenticateToken, createActivity);

module.exports = router;

// utils/responseHandler.js
exports.successResponse = (res, message, data) => {
    res.status(200).json({ message, data });
};

exports.errorResponse = (res, error) => {
    res.status(500).json({ error });
};