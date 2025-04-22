const express = require('express');
const { homeData } = require('../controllers/GeneralController')
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/home', authenticateToken, homeData);

module.exports = router;

// utils/responseHandler.js
exports.successResponse = (res, message, data) => {
    res.status(200).json({ message, data });
};

exports.errorResponse = (res, error) => {
    res.status(500).json({ error });
};