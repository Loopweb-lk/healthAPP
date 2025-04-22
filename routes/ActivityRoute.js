const express = require('express');
const { createActivity } = require('../controllers/ActivityController')
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/createActivity', authenticateToken, createActivity);

module.exports = router;

// utils/responseHandler.js
exports.successResponse = (res, message, data) => {
    res.status(200).json({ message, data });
};

exports.errorResponse = (res, error) => {
    res.status(500).json({ error });
};