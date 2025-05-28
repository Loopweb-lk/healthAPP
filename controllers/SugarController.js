const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SugerRecord = require('../models/SugerRecord');
const path = require('path');
const Notification = require('../models/Notification');

exports.createRecord = async (req, res) => {
    const { level, meal, note, timestamp } = req.body;

    try {
        const user = await User.findByUsername(req.user.username);
        await SugerRecord.create(level, meal, note, timestamp, user.id);
        if (level > 120) {
            const notifications = await Notification.create('Sugar levels High!', 'Sugar levels are too High, Please take precautions', user.id);
        }
        res.status(201).json({ message: 'Sugar Log created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getAllRecords = async (req, res) => {
    try {
        const user = await User.findByUsername(req.user.username);
        const records = await SugerRecord.findAll(user.id);
        res.status(200).json({ records });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.findByDateRange = async (req, res) => {
    const { fromDate, toDate } = req.body;

    try {
        const user = await User.findByUsername(req.user.username);
        const records = await SugerRecord.findByDateRange(fromDate, toDate, user.id);
        res.status(200).json({ records });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

