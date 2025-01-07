const dbService = require('../config/dbService');

const User = {
    create: async (username, email, password) => {
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        return await dbService.query(sql, [username, email, password]);
    },

    findByUsername: async (username) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        const results = await dbService.query(sql, [username]);
        return results[0];
    },
};

module.exports = User;