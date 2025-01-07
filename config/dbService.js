const pool = require('./db');

exports.query = async (sql, params) => {
    const [results] = await pool.execute(sql, params);
    return results;
};