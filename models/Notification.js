const dbService = require('../config/dbService');

const Notification = {
    create: async (title, msg, user) => {
        const sql = 'INSERT INTO notification (title, msg, user) VALUES (?, ?, ?)';
        return await dbService.query(sql, [title, msg, user]);
    },

    findAll: async (user) => {
        const sql = 'SELECT id, title, msg, timestamp FROM notification WHERE user = ? ORDER BY timestamp DESC';
        const results = await dbService.query(sql, [user]);
        return results;
    },

    deleteById: async (id) => {
        const sql = 'DELETE FROM notification WHERE id = ?';
        const result = await dbService.query(sql, [id]);
        return result;
    }

};

module.exports = Notification;