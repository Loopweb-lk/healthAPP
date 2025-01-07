const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');

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
    ],
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});