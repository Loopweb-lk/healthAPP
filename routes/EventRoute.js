const express = require('express');
const { createRecord, getAllRecords } = require('../controllers/EventController')
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/createRecord', authenticateToken, createRecord);
router.get('/events', authenticateToken, getAllRecords);

module.exports = router;

// utils/responseHandler.js
exports.successResponse = (res, message, data) => {
    res.status(200).json({ message, data });
};

exports.errorResponse = (res, error) => {
    res.status(500).json({ error });
};