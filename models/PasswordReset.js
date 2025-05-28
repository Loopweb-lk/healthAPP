const dbService = require('../config/dbService');

const PasswordReset = {
    create: async (email, token) => {
        const sql = 'INSERT INTO password_reset (email, token ) VALUES (?, ?)';
        return await dbService.query(sql, [email, token]);
    },

    findAll: async () => {
        const sql = 'SELECT id, email, token FROM password_reset';
        const results = await dbService.query(sql);
        return results;
    },

    findByToken: async (token) => {
        const sql = 'SELECT id, email, token FROM password_reset WHERE token = ?';
        const results = await dbService.query(sql, [token]);
        return results;
    },

};

module.exports = PasswordReset;