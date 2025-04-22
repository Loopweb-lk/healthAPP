const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Event = require('../models/Event');
const path = require('path');

exports.createRecord = async (req, res) => {
    const { eventName, eventTime, selectedDate } = req.body;

    try {
        await Event.create(eventName, eventTime, selectedDate);
        res.status(201).json({ message: 'Event created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getAllRecords = async (req, res) => {
    try {
        const records = await Event.findAll();
        res.status(200).json({ records });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};
