const express = require('express');
const { getMeals, getIngredients, getIngredientsPdf, createFoodItem, createFoodItems, getFoods, getFoodItems, createMeal, findByDateRange, getAllMeals, deleteMeal, cloneMeal } = require('../controllers/MealController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/meal/getMeals:
 *   get:
 *     tags:
 *       - Meal Planner
 *     summary: Get planned meals
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Meal plan data
 *       500:
 *         description: Internal server error
 */
router.get('/getMeals', authenticateToken, getMeals);

/**
 * @swagger
 * /api/meal/getIngredients:
 *   post:
 *     tags:
 *       - Meal Planner
 *     summary: Get ingredients for the meals
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Food item IDs comma separated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               food_ids:
 *                 type: string
 *                 example: "1,2,3"
 *             required:
 *               - food_ids
 *     responses:
 *       200:
 *         description: List of ingredient quantities
 *       500:
 *         description: Internal server error
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
router.get('/getIngredientPDF', getIngredientsPdf);

/**
 * @swagger
 * /api/meal/createFoodItem:
 *   post:
 *     tags:
 *       - Meal Planner
 *     summary: Create new Food Item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Food item data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               size:
 *                 type: string
 *               calorie:
 *                 type: number
 *               type:
 *                 type: string
 *               image:
 *                 type: string
 *             required:
 *               - name
 *               - category
 *               - calorie
 *     responses:
 *       201:
 *         description: Food Item created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/createFoodItem', authenticateToken, createFoodItem);

/**
 * @swagger
 * /api/meal/foodItems:
 *   get:
 *     tags:
 *       - Meal Planner
 *     summary: Get food items by meal type
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of food items
 *       500:
 *         description: Internal server error
 */
router.get('/foodItems', authenticateToken, getFoods);

/**
 * @swagger
 * /api/meal/foodItemsList:
 *   get:
 *     tags:
 *       - Meal Planner
 *     summary: Get all food items list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all food items
 *       500:
 *         description: Internal server error
 */
router.get('/foodItemsList', authenticateToken, getFoodItems);

/**
 * @swagger
 * /api/meal/createMeal:
 *   post:
 *     tags:
 *       - Meal Planner
 *     summary: Create a new meal
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Meal details and selected items
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               totalCal:
 *                 type: number
 *               selectedItems:
 *                 type: array
 *                 items:
 *                   type: object
 *               mealType:
 *                 type: string
 *             required:
 *               - name
 *               - date
 *               - timestamp
 *               - totalCal
 *               - selectedItems
 *               - mealType
 *     responses:
 *       201:
 *         description: Meal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 mealId:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
router.post('/createMeal', authenticateToken, createMeal);

/**
 * @swagger
 * /api/meal/meals:
 *   get:
 *     tags:
 *       - Meal Planner
 *     summary: Get all meals for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of meal items
 *       500:
 *         description: Internal server error
 */
router.get('/meals', authenticateToken, getAllMeals);

/**
 * @swagger
 * /api/meal/findByDateRange:
 *   post:
 *     tags:
 *       - Meal Planner
 *     summary: Find meal or sugar records by date range
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Date range filter
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
 *         description: Records within date range
 *       500:
 *         description: Internal server error
 */
router.post('/findByDateRange', authenticateToken, findByDateRange);

/**
 * @swagger
 * /api/meal/deleteMeal:
 *   post:
 *     tags:
 *       - Meal Planner
 *     summary: Delete a meal by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Meal ID to delete
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *             required:
 *               - id
 *     responses:
 *       201:
 *         description: Meal deleted successfully
 *       500:
 *         description: Internal server error
 */
router.post('/deleteMeal', authenticateToken, deleteMeal);

/**
 * @swagger
 * /api/meal/cloneMeal:
 *   post:
 *     tags:
 *       - Meal Planner
 *     summary: Clone a meal by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Meal ID to clone
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Meal data for cloning
 *       500:
 *         description: Internal server error
 */
router.post('/cloneMeal', authenticateToken, cloneMeal);

module.exports = router;

// utils/responseHandler.js
exports.successResponse = (res, message, data) => {
    res.status(200).json({ message, data });
};

exports.errorResponse = (res, error) => {
    res.status(500).json({ error });
};