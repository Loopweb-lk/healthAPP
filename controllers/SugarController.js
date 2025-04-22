const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SugerRecord = require('../models/SugerRecord');
const path = require('path');

exports.createRecord = async (req, res) => {
    const { level, meal, note, timestamp } = req.body;

    try {
        await SugerRecord.create(level, meal, note, timestamp);
        res.status(201).json({ message: 'Sugar Log created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getAllRecords = async (req, res) => {
    try {
        const records = await SugerRecord.findAll();
        res.status(200).json({ records });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.findByDateRange = async (req, res) => {
    const { fromDate, toDate } = req.body;

    try {
        const records = await SugerRecord.findByDateRange(fromDate, toDate);
        res.status(200).json({ records });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

