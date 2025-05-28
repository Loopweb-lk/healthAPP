const dbService = require('../config/dbService');

const Meal = {
    create: async (name, date, timestamp, totalCal, mealType, user) => {
        const sql = 'INSERT INTO meal (name, date, timestamp, totalCal, type, user) VALUES (?, ?, ?, ?, ?, ?)';
        return await dbService.query(sql, [name, date, timestamp, totalCal, mealType, user]);
    },

    findAll: async (user) => {
        const sql = 'SELECT id, name, date, timestamp, totalCal, type FROM meal WHERE user = ? ORDER BY timestamp DESC';
        const results = await dbService.query(sql, [user]);
        return results;
    },

    findByType: async (type, user) => {
        const sql = 'SELECT id, name, date, timestamp, totalCal, type FROM meal WHERE type = ? AND user = ?';
        const results = await dbService.query(sql, [type, user]);
        return results;
    },

    findById: async (id) => {
        const sql = 'SELECT id, name, date, timestamp, totalCal, type FROM meal WHERE id = ?';
        const results = await dbService.query(sql, [id]);
        return results[0];
    },

    findLatestOfEachType: async (user) => {
        const sql = `
            SELECT m.*
            FROM meal m
            INNER JOIN (
            SELECT type, MAX(timestamp) as max_timestamp
            FROM meal
            where user = ?
            GROUP BY type
            ) latest
            ON m.type = latest.type AND m.timestamp = latest.max_timestamp
        `;
        const results = await dbService.query(sql, [user]);
        return results;
    },


    findByDateRange: async (fromDate, toDate, user) => {
        const sql = `SELECT id, name, date, timestamp, totalCal, type FROM meal WHERE date BETWEEN ? AND ? AND user = ?`;
        const results = await dbService.query(sql, [fromDate, toDate, user]);
        return results;
    },

    deleteById: async (id) => {
        const sql = 'DELETE FROM meal WHERE id = ?';
        const result = await dbService.query(sql, [id]);
        return result;
    }

};

module.exports = Meal;