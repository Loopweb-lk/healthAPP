const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Activity = require('../models/Activity');
const path = require('path');

exports.createActivity = async (req, res) => {
    const { activity, timePeriod, timestamp, burnedCal } = req.body;

    try {
        const user = await User.findByUsername(req.user.username);
        await Activity.create(activity, timePeriod, timestamp, burnedCal, user.id);
        res.status(201).json({ message: 'Activity Log created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getAllRecords = async (req, res) => {
    try {
        const user = await User.findByUsername(req.user.username);
        const records = await Activity.findAll(user.id);
        res.status(200).json({ records });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

