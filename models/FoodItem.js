const dbService = require('../config/dbService');

const FoodItem = {
    create: async (name, category, size, calorie, type, image) => {
        const sql = 'INSERT INTO food (name, category, size, calorie, type, image ) VALUES (?, ?, ?, ?, ?, ?)';
        return await dbService.query(sql, [name, category, size, calorie, type, image]);
    },

    findAll: async () => {
        const sql = 'SELECT id, name, category, size, calorie, type, image FROM food';
        const results = await dbService.query(sql);
        return results;
    },

    findByType: async (type) => {
        const sql = 'SELECT id, name, category, size, calorie, type FROM food WHERE type = ?';
        const results = await dbService.query(sql, [type]);
        return results;
    },
};

module.exports = FoodItem;