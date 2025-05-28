const dbService = require('../config/dbService');

const SugerRecord = {
    create: async (level, meal, note, timestamp, user) => {
        const sql = 'INSERT INTO sugar (level, meal, note, timestamp, user) VALUES (?, ?, ?, ?, ?)';
        return await dbService.query(sql, [level, meal, note, timestamp, user]);
    },

    findAll: async (user) => {
        const sql = 'SELECT id, level, meal, note, timestamp FROM sugar WHERE user = ? ORDER BY timestamp DESC';
        const results = await dbService.query(sql, [user]);
        return results;
    },

    findById: async (id) => {
        const sql = 'SELECT id, level, meal, note, timestamp FROM sugar WHERE id = ?';
        const results = await dbService.query(sql, [id]);
        return results[0];
    },

    findByDateRange: async (fromDate, toDate, user) => {
        const fromDateTime = `${fromDate}T00:00:00.000Z`;
        const toDateTime = `${toDate}T23:59:59.999Z`;

        const sql = `SELECT id, level, meal, note, timestamp FROM sugar WHERE timestamp BETWEEN ? AND ? AND user = ?`;
        const results = await dbService.query(sql, [fromDateTime, toDateTime, user]);
        return results;
    }
}

module.exports = SugerRecord;