const express = require('express');
const { homeData, getPasswordReset, getPasswordResetLogin, getProfile, updateProfile, createContact, getContacts, deleteContact, getMealOverview, getActivityOverview, getNotifications, deleteNotifications } = require('../controllers/GeneralController')
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/general/home:
 *   get:
 *     tags:
 *       - General
 *     summary: Get home dashboard data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data including meals, activities, sugar, events
 *       500:
 *         description: Internal server error
 */
router.get('/home', authenticateToken, homeData);

/**
 * @swagger
 * /api/general/getPasswordReset:
 *   get:
 *     tags:
 *       - General
 *     summary: Send password reset token email to logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password reset token sent
 *       500:
 *         description: Internal server error
 */
router.get('/getPasswordReset', authenticateToken, getPasswordReset);

/**
 * @swagger
 * /api/general/getProfile:
 *   get:
 *     tags:
 *       - General
 *     summary: Get logged-in user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       500:
 *         description: Internal server error
 */
router.get('/getProfile', authenticateToken, getProfile);

/**
 * @swagger
 * /api/general/updateProfile:
 *   post:
 *     tags:
 *       - General
 *     summary: Update logged-in user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Profile fields to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mealType:
 *                 type: string
 *               CB:
 *                 type: string
 *               CI:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found or no changes made
 *       500:
 *         description: Internal server error
 */
router.post('/updateProfile', authenticateToken, updateProfile);

/**
 * @swagger
 * /api/general/createContact:
 *   post:
 *     tags:
 *       - General
 *     summary: Create a new contact
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Contact details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               number:
 *                 type: string
 *             required:
 *               - name
 *               - number
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/createContact', authenticateToken, createContact);

/**
 * @swagger
 * /api/general/getContacts:
 *   get:
 *     tags:
 *       - General
 *     summary: Get all contacts of logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts
 *       500:
 *         description: Internal server error
 */
router.get('/getContacts', authenticateToken, getContacts);


/**
 * @swagger
 * /api/general/deleteContact:
 *   post:
 *     tags:
 *       - General
 *     summary: Delete a Contact by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Contact ID to delete
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *             required:
 *               - id
 *     responses:
 *       201:
 *         description: Contact deleted successfully
 *       500:
 *         description: Internal server error
 */
router.post('/deleteContact', authenticateToken, deleteContact);

/**
 * @swagger
 * /api/general/getMealOverview:
 *   get:
 *     tags:
 *       - General
 *     summary: Get meal and sugar overview data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Meal overview data
 *       500:
 *         description: Internal server error
 */
router.get('/getMealOverview', authenticateToken, getMealOverview);

/**
 * @swagger
 * /api/general/getActivityOverview:
 *   get:
 *     tags:
 *       - General
 *     summary: Get activity overview data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity overview data
 *       500:
 *         description: Internal server error
 */
router.get('/getActivityOverview', authenticateToken, getActivityOverview);

/**
 * @swagger
 * /api/general/getNotifications:
 *   get:
 *     tags:
 *       - General
 *     summary: Get all notifications for logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *       500:
 *         description: Internal server error
 */
router.get('/getNotifications', authenticateToken, getNotifications);

/**
 * @swagger
 * /api/general/deleteNotifications:
 *   post:
 *     tags:
 *       - General
 *     summary: Delete a notification by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Notification ID to delete
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *             required:
 *               - id
 *     responses:
 *       201:
 *         description: Notification deleted successfully
 *       500:
 *         description: Internal server error
 */
router.post('/deleteNotifications', authenticateToken, deleteNotifications);

/**
 * @swagger
 * /api/general/getPasswordResetLogin:
 *   post:
 *     tags:
 *       - General
 *     summary: Send password reset token for given email
 *     requestBody:
 *       description: Email to send reset token
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Success message on sending reset token
 *       500:
 *         description: Internal server error
 */
router.post('/getPasswordResetLogin', getPasswordResetLogin);

module.exports = router;

exports.successResponse = (res, message, data) => {
    res.status(200).json({ message, data });
};

exports.errorResponse = (res, error) => {
    res.status(500).json({ error });
};