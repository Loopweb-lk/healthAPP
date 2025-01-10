const dbService = require('../config/dbService');

const FoodItem = {
    create: async (name, category, size, weight, calorie) => {
        const sql = 'INSERT INTO food (name, category, size, weight, calorie ) VALUES (?, ?, ?, ?, ?)';
        return await dbService.query(sql, [name, category, size, weight, calorie]);
    },

    findAll: async () => {
        const sql = 'SELECT name, category, size, calorie FROM food';
        const results = await dbService.query(sql);
        return results;
    },
};

module.exports = FoodItem;