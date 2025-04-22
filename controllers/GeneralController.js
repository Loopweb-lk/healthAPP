const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Meal = require('../models/Meal');
const SugerRecord = require('../models/SugerRecord');
const Event = require('../models/Event');
const path = require('path');
const { timeStamp } = require('console');

exports.homeData = async (req, res) => {
    try {
        const rawMeals = await Meal.findLatestOfEachType();

        const mealData = {
            breakfast: { name: 'Not Found', totalCal: 0 },
            lunch: { name: 'Not Found', totalCal: 0 },
            dinner: { name: 'Not Found', totalCal: 0 },
        };

        rawMeals.forEach((meal) => {
            const entry = {
                name: meal.name,
                totalCal: meal.totalCal,
            };

            if (meal.type.toLowerCase() === 'breakfast') {
                mealData.breakfast = entry;
            } else if (meal.type.toLowerCase() === 'lunch') {
                mealData.lunch = entry;
            } else if (meal.type.toLowerCase() === 'dinner') {
                mealData.dinner = entry;
            }
        });

        let activity = await Activity.findAll();
        activity = activity[0];

        let sugarRecord = await SugerRecord.findAll();
        sugarRecord = sugarRecord[0]

        let records = await Event.findAll();

        const topThree = records.slice(0, 3).map(item => ({
            name: item.eventName,
            timeStamp: item.selectedDate,
            date: new Date(item.selectedDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short'
            })
        }));


        res.status(200).json({ mealData: mealData, activity: activity, sugar: sugarRecord, event: topThree });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

