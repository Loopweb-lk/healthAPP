const express = require('express');
const { getMeals } = require('../controllers/MealController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/meal/getMeals:
 *   get:
 *     tags:
 *       - Meal Planner
 *     summary: Get planned meals 
 *     responses:
 *       201:
 *         description: JSON
 */
router.get('/getMeals', getMeals);


module.exports = router;

// utils/responseHandler.js
exports.successResponse = (res, message, data) => {
    res.status(200).json({ message, data });
};

exports.errorResponse = (res, error) => {
    res.status(500).json({ error });
};