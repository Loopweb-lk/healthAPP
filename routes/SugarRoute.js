const express = require('express');
const { createRecord, getAllRecords, findByDateRange } = require('../controllers/SugarController')
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/sugar/createRecord:
 *   post:
 *     tags:
 *       - Sugar Record
 *     summary: Create a new sugar level record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Sugar record details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               level:
 *                 type: number
 *                 example: 130
 *               meal:
 *                 type: string
 *                 example: Breakfast
 *               note:
 *                 type: string
 *                 example: Felt dizzy
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - level
 *               - meal
 *               - timestamp
 *     responses:
 *       201:
 *         description: Sugar Log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sugar Log created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/createRecord', authenticateToken, createRecord);

/**
 * @swagger
 * /api/sugar/sugar:
 *   get:
 *     tags:
 *       - Sugar Record
 *     summary: Get all sugar records for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sugar records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       level:
 *                         type: number
 *                       meal:
 *                         type: string
 *                       note:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 */
router.get('/sugar', authenticateToken, getAllRecords);

/**
 * @swagger
 * /api/sugar/findByDateRange:
 *   post:
 *     tags:
 *       - Sugar Record
 *     summary: Find sugar records by date range
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Date range for sugar records
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromDate:
 *                 type: string
 *                 format: date
 *               toDate:
 *                 type: string
 *                 format: date
 *             required:
 *               - fromDate
 *               - toDate
 *     responses:
 *       200:
 *         description: Sugar records within date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       level:
 *                         type: number
 *                       meal:
 *                         type: string
 *                       note:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 */
router.post('/findByDateRange', authenticateToken, findByDateRange);
module.exports = router;

// utils/responseHandler.js
exports.successResponse = (res, message, data) => {
    res.status(200).json({ message, data });
};

exports.errorResponse = (res, error) => {
    res.status(500).json({ error });
};