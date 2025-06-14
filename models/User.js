const dbService = require('../config/dbService');

const User = {
    create: async (username, email, password, mealType, calorieBurn, calorieIntake) => {
        const sql = 'INSERT INTO users (username, email, password, mealType, calorieBurn, calorieIntake ) VALUES (?, ?, ?, ?, ?, ?)';
        return await dbService.query(sql, [username, email, password, mealType, calorieBurn, calorieIntake]);
    },

    findByUsername: async (username) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        const results = await dbService.query(sql, [username]);
        return results[0];
    },

    changePassword: async (email, newPassword) => {
        const sql = 'UPDATE users SET password = ? WHERE email = ?';
        return await dbService.query(sql, [newPassword, email]);
    },

    updateByEmail: async (username, email, mealType, calorieBurn, calorieIntake) => {
        const sql = `
          UPDATE users
          SET username = ?, mealType = ?, calorieBurn = ?, calorieIntake = ?
          WHERE email = ?
        `;
        return await dbService.query(sql, [username, mealType, calorieBurn, calorieIntake, email]);
    },


};

module.exports = User;