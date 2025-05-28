const express = require('express');
const { createRecord, getAllRecords } = require('../controllers/EventController')
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/event/createRecord:
 *   post:
 *     tags:
 *       - Event
 *     summary: Create a new event record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Event details to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *                 example: Doctor Appointment
 *               eventTime:
 *                 type: string
 *                 example: 15:30
 *               selectedDate:
 *                 type: string
 *                 format: date
 *             required:
 *               - eventName
 *               - eventTime
 *               - selectedDate
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/createRecord', authenticateToken, createRecord);

/**
 * @swagger
 * /api/event/events:
 *   get:
 *     tags:
 *       - Event
 *     summary: Get all events for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of event records
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
 *                       eventName:
 *                         type: string
 *                       eventTime:
 *                         type: string
 *                       selectedDate:
 *                         type: string
 *                         format: date
 *       500:
 *         description: Internal server error
 */
router.get('/events', authenticateToken, getAllRecords);

module.exports = router;

// utils/responseHandler.js
exports.successResponse = (res, message, data) => {
    res.status(200).json({ message, data });
};

exports.errorResponse = (res, error) => {
    res.status(500).json({ error });
};