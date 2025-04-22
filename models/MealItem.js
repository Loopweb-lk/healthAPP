const dbService = require('../config/dbService');

const MealItem = {
    create: async (food_id, meal_id) => {
        const sql = 'INSERT INTO meal_item (food_id, meal_id) VALUES (?, ?)';
        return await dbService.query(sql, [food_id, meal_id]);
    },

    findAll: async () => {
        const sql = 'SELECT food_id, meal_id FROM meal_item';
        const results = await dbService.query(sql);
        return results;
    },

    findById: async (id) => {
        const sql = 'SELECT food_id, meal_id FROM meal_item WHERE meal_id = ?';
        const results = await dbService.query(sql, [id]);
        return results;
    },

    deleteByMealId: async (mealId) => {
        const sql = 'DELETE FROM meal_item WHERE meal_id = ?';
        const result = await dbService.query(sql, [mealId]);
        return result;
    }

};

module.exports = MealItem;