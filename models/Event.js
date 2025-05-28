const dbService = require('../config/dbService');

const Event = {

    create: async (eventName, eventTime, selectedDate, user) => {
        const sql = 'INSERT INTO event (eventName, eventTime, selectedDate, user) VALUES (?, ?, ?, ?)';
        return await dbService.query(sql, [eventName, eventTime, selectedDate, user]);
    },

    findAll: async (user) => {
        const sql = 'SELECT id, eventName, eventTime, selectedDate FROM event WHERE user = ? ORDER BY selectedDate DESC';
        const results = await dbService.query(sql, [user]);
        return results;
    },
}

module.exports = Event;