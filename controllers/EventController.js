const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Event = require('../models/Event');
const path = require('path');

exports.createRecord = async (req, res) => {
    const { eventName, eventTime, selectedDate } = req.body;

    try {
        const user = await User.findByUsername(req.user.username);
        await Event.create(eventName, eventTime, selectedDate, user.id);
        res.status(201).json({ message: 'Event created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getAllRecords = async (req, res) => {
    try {
        const user = await User.findByUsername(req.user.username);
        const records = await Event.findAll(user.id);
        res.status(200).json({ records });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};
