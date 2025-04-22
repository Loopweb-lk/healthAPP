const express = require('express');
const { getMeals, getIngredients, getIngredientsPdf, createFoodItem, getFoodItems, createMeal, findByDateRange, getAllMeals, deleteMeal, cloneMeal } = require('../controllers/MealController');
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
router.get('/getMeals', authenticateToken, getMeals);

/**
 * @swagger
 * /api/meal/getIngredients:
 *   post:
 *     tags:
 *       - Meal Planner
 *     summary: Get ingredients for the meals 
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               food_ids:
 *                 type: string
 *             required:
 *               - food_ids
 *     responses:
 *       201:
 *         description: JSON
 */
router.post('/getIngredients', authenticateToken, getIngredients);

/**
 * @swagger
 * /api/meal/getIngredientPDF:
 *   get:
 *     tags:
 *       - Meal Planner
 *     summary: Get the grocery list as a PDF
 *     responses:
 *       200:
 *         description: Grocery list PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: PDF file not found
 */
router.get('/getIngredientPDF', authenticateToken, getIngredientsPdf);

/**
 * @swagger
 * /api/meal/createFoodItem:
 *   post:
 *     tags:
 *       - Meal Planner
 *     summary: Create new Meal item 
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               food_ids:
 *                 type: string
 *             required:
 *               - food_ids
 *     responses:
 *       201:
 *         description: JSON
 */
router.post('/createFoodItem', authenticateToken, createFoodItem);

router.get('/foodItems', authenticateToken, getFoodItems);

router.post('/createMeal', authenticateToken, createMeal);

router.get('/meals', authenticateToken, getAllMeals);

router.post('/findByDateRange', authenticateToken, findByDateRange);

router.post('/deleteMeal', authenticateToken, deleteMeal);

router.post('/cloneMeal', authenticateToken, cloneMeal);

module.exports = router;

// utils/responseHandler.js
exports.successResponse = (res, message, data) => {
    res.status(200).json({ message, data });
};

exports.errorResponse = (res, error) => {
    res.status(500).json({ error });
};