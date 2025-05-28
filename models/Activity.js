const dbService = require('../config/dbService');

const Activity = {

    create: async (activity, timePeriod, timestamp, burnedCal, user) => {
        const sql = 'INSERT INTO activity (activity, timePeriod, timestamp, user, burnedCal) VALUES (?, ?, ?, ?, ?)';
        return await dbService.query(sql, [activity, timePeriod, timestamp, user, burnedCal]);
    },

    findAll: async (user) => {
        const sql = 'SELECT activity, timePeriod, timestamp, burnedCal FROM activity WHERE user = ? ORDER BY timestamp DESC';
        const results = await dbService.query(sql, [user]);
        return results;
    },

    findById: async (id) => {
        const sql = 'SELECT id, activity, timePeriod, timestamp, burnedCal FROM activity WHERE id = ?';
        const results = await dbService.query(sql, [id]);
        return results[0];
    },

    findByDateRange: async (fromDate, toDate) => {
        const sql = `SELECT id, activity, timePeriod, timestamp, burnedCal FROM activity WHERE timestamp BETWEEN ? AND ?`;
        const results = await dbService.query(sql, [fromDate, toDate]);
        return results;
    }
}

module.exports = Activity;