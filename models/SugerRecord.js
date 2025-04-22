const dbService = require('../config/dbService');

const SugerRecord = {
    create: async (level, meal, note, timestamp) => {
        const sql = 'INSERT INTO sugar (level, meal, note, timestamp) VALUES (?, ?, ?, ?)';
        return await dbService.query(sql, [level, meal, note, timestamp]);
    },

    findAll: async () => {
        const sql = 'SELECT id, level, meal, note, timestamp FROM sugar ORDER BY timestamp DESC';
        const results = await dbService.query(sql);
        return results;
    },

    findById: async (id) => {
        const sql = 'SELECT id, level, meal, note, timestamp FROM sugar WHERE id = ?';
        const results = await dbService.query(sql, [id]);
        return results[0];
    },

    findByDateRange: async (fromDate, toDate) => {
        const fromDateTime = `${fromDate}T00:00:00.000Z`;
        const toDateTime = `${toDate}T23:59:59.999Z`;

        const sql = `SELECT id, level, meal, note, timestamp FROM sugar WHERE timestamp BETWEEN ? AND ?`;
        const results = await dbService.query(sql, [fromDateTime, toDateTime]);
        return results;
    }
}

module.exports = SugerRecord;