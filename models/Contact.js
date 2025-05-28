const dbService = require('../config/dbService');

const Contact = {
    create: async (name, number, user) => {
        const sql = 'INSERT INTO contact (name, number, user) VALUES (?, ?, ?)';
        return await dbService.query(sql, [name, number, user]);
    },

    findAll: async (user) => {
        const sql = 'SELECT id, name, number FROM contact WHERE user = ?';
        const results = await dbService.query(sql, [user]);
        return results;
    },

    deleteById: async (id) => {
        const sql = 'DELETE FROM contact WHERE id = ?';
        const result = await dbService.query(sql, [id]);
        return result;
    }
};

module.exports = Contact;