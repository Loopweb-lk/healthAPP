const express = require('express');
const { createRecord, getAllRecords, findByDateRange } = require('../controllers/SugarController')
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/createRecord', authenticateToken, createRecord);

router.get('/sugar', authenticateToken, getAllRecords);

router.post('/findByDateRange', authenticateToken, findByDateRange);
module.exports = router;

// utils/responseHandler.js
exports.successResponse = (res, message, data) => {
    res.status(200).json({ message, data });
};

exports.errorResponse = (res, error) => {
    res.status(500).json({ error });
};