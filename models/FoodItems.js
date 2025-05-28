const dbService = require('../config/dbService');

const FoodItems = {
    create: async (name, calorie) => {
        const sql = 'INSERT INTO food_items (item_name, calorie ) VALUES (?, ?)';
        return await dbService.query(sql, [name, calorie]);
    },

    findAll: async () => {
        const sql = 'SELECT id, item_name, calorie FROM food_items';
        const results = await dbService.query(sql);
        return results;
    },
};

module.exports = FoodItems;