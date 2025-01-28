const dbService = require('../config/dbService');

const IngredientItem = {
    create: async (item, food_id) => {
        const sql = 'INSERT INTO ingredient_item (item, food_id, quantity ) VALUES (?, ?, ?)';
        return await dbService.query(sql, [item, food_id]);
    },

    findAll: async () => {
        const sql = 'SELECT id, item, quantity, food_id FROM ingredient_item';
        const results = await dbService.query(sql);
        return results;
    },

    findItemByFood: async (food_id) => {
        const sql = 'SELECT id, item, quantity, food_id FROM ingredient_item WHERE food_id = ?';
        const results = await dbService.query(sql, [food_id]);
        return results;
    },
};

module.exports = IngredientItem;