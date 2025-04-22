const dbService = require('../config/dbService');

const Event = {

    create: async (eventName, eventTime, selectedDate) => {
        const sql = 'INSERT INTO event (eventName, eventTime, selectedDate) VALUES (?, ?, ?)';
        return await dbService.query(sql, [eventName, eventTime, selectedDate]);
    },

    findAll: async () => {
        const sql = 'SELECT id, eventName, eventTime, selectedDate FROM event ORDER BY selectedDate DESC';
        const results = await dbService.query(sql);
        return results;
    },
}

module.exports = Event;