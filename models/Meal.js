const dbService = require('../config/dbService');

const Meal = {
    create: async (name, date, timestamp, totalCal, mealType) => {
        const sql = 'INSERT INTO meal (name, date, timestamp, totalCal, type) VALUES (?, ?, ?, ?, ?)';
        return await dbService.query(sql, [name, date, timestamp, totalCal, mealType]);
    },

    findAll: async () => {
        const sql = 'SELECT id, name, date, timestamp, totalCal, type FROM meal ORDER BY timestamp DESC';
        const results = await dbService.query(sql);
        return results;
    },

    findByType: async (type) => {
        const sql = 'SELECT id, name, date, timestamp, totalCal, type FROM meal WHERE type = ?';
        const results = await dbService.query(sql, [type]);
        return results;
    },

    findById: async (id) => {
        const sql = 'SELECT id, name, date, timestamp, totalCal, type FROM meal WHERE id = ?';
        const results = await dbService.query(sql, [id]);
        return results[0];
    },

    findLatestOfEachType: async () => {
        const sql = `
            SELECT m.*
            FROM meal m
            INNER JOIN (
            SELECT type, MAX(timestamp) as max_timestamp
            FROM meal
            GROUP BY type
            ) latest
            ON m.type = latest.type AND m.timestamp = latest.max_timestamp
        `;
        const results = await dbService.query(sql);
        return results;
    },


    findByDateRange: async (fromDate, toDate) => {
        const sql = `SELECT id, name, date, timestamp, totalCal, type FROM meal WHERE date BETWEEN ? AND ?`;
        const results = await dbService.query(sql, [fromDate, toDate]);
        return results;
    },

    deleteById: async (id) => {
        const sql = 'DELETE FROM meal WHERE id = ?';
        const result = await dbService.query(sql, [id]);
        return result;
    }

};

module.exports = Meal;