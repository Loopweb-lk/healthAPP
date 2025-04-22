const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/MealPlannerRoute');
const activityRoute = require('./routes/ActivityRoute');
const sugarRoute = require('./routes/SugarRoute');
const eventRoute = require('./routes/EventRoute');
const generalRoute = require('./routes/GeneralRoute');

// Load environment variables
const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(express.json());

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Health Platform API',
            version: '1.0.0',
            description: 'RESTful APIs for health monitoring platform',
        },
    },
    tags: [
        {
            name: "Authentication",
            description: "APIs related to user authentication",
        },
        {
            name: "Meal Planner",
            description: "APIs related to Meals",
        },
    ],
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meal', mealRoutes);
app.use('/api/activity', activityRoute);
app.use('/api/sugar', sugarRoute);
app.use('/api/event', eventRoute);
app.use('/api/general', generalRoute);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});