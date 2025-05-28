const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Meal = require('../models/Meal');
const SugerRecord = require('../models/SugerRecord');
const PasswordReset = require('../models/PasswordReset');
const Event = require('../models/Event');
const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const path = require('path');
const { timeStamp } = require('console');
var nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

exports.homeData = async (req, res) => {
    try {
        const user = await User.findByUsername(req.user.username);
        const user_id = user.id;
        const rawMeals = await Meal.findLatestOfEachType(user_id);

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

        let activity = await Activity.findAll(user_id);
        if (activity.length > 0) {
            activity = activity[0];
        } else {
            activity = {}
        }

        let sugarRecord = await SugerRecord.findAll(user_id);
        if (sugarRecord.length > 0) {
            sugarRecord = sugarRecord[0];
        } else {
            sugarRecord = {}
        }

        let records = await Event.findAll(user_id);
        let topThree = [];

        if (records.length > 0) {
            topThree = records.slice(0, 3).map(item => ({
                name: item.eventName,
                timeStamp: item.selectedDate,
                date: new Date(item.selectedDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short'
                })
            }));
        }

        res.status(200).json({ mealData: mealData, activity: activity, sugar: sugarRecord, event: topThree });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getPasswordReset = async (req, res) => {
    try {
        const user = await User.findByUsername(req.user.username);

        const myUuid = uuidv4();
        await PasswordReset.create(user.email, myUuid);

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'loopwebapi@gmail.com',
                pass: 'hyuv cqle spvw etwt'
            }
        });

        var mailOptions = {
            from: 'healthApp@gmail.com',
            to: user.email,
            subject: 'Password Reset Token for Health APP Platform',
            html: `<h2>This is your password reset token</h2> Access Token: <b>${myUuid}</b>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

exports.getPasswordResetLogin = async (req, res) => {
    try {
        const { email } = req.body;
        const myUuid = uuidv4();
        await PasswordReset.create(email, myUuid);

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'loopwebapi@gmail.com',
                pass: 'hyuv cqle spvw etwt'
            }
        });

        var mailOptions = {
            from: 'healthApp@gmail.com',
            to: email,
            subject: 'Password Reset Token for Health APP Platform',
            html: `<h2>This is your password reset token</h2> Access Token: <b>${myUuid}</b>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: "success" });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

exports.getProfile = async (req, res) => {
    const user = await User.findByUsername(req.user.username);
    res.status(200).json({ user });
}

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, mealType, CB, CI } = req.body;

        const result = await User.updateByEmail(
            name,
            email,
            mealType,
            CB,
            CI
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Profile updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found or no changes made' });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.createContact = async (req, res) => {
    const { name, number } = req.body;

    try {
        const user = await User.findByUsername(req.user.username);
        await Contact.create(name, number, user.id);
        res.status(201).json({ message: 'Contact created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const user = await User.findByUsername(req.user.username);
        const contacts = await Contact.findAll(user.id);
        res.status(200).json({ contacts });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.deleteContact = async (req, res) => {
    const { id } = req.body;

    try {
        await Contact.deleteById(id);
        res.status(201).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getMealOverview = async (req, res) => {
    try {
        const user = await User.findByUsername(req.user.username);
        const sugarRecords = await SugerRecord.findAll(user.id);
        const mealRecords = await Meal.findAll(user.id);

        const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

        const now = new Date();

        const formatDate = (d) => {
            const dateObj = d instanceof Date ? d : new Date(d);
            return dateObj.toISOString().slice(0, 10);
        };


        // === 1. Build calorieData and sugarData for last 7 days ===
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date(now);
            d.setDate(now.getDate() - (6 - i)); // from 6 days ago to today
            return d;
        });

        // Sum values per day for calories and sugar
        const sumByDay = (records, dateField, valueField) => {
            const sums = {};
            last7Days.forEach(d => {
                sums[formatDate(d)] = 0;
            });
            records.forEach(r => {
                const dateStr = formatDate(r[dateField]);
                if (dateStr in sums) sums[dateStr] += r[valueField];
            });
            return sums;
        };

        const mealCalByDay = sumByDay(mealRecords, 'date', 'totalCal');
        const sugarLevelByDay = sumByDay(sugarRecords, 'timestamp', 'level');

        const calorieData = last7Days.map(d => ({
            value: mealCalByDay[formatDate(d)] || 0,
            label: dayLabels[d.getDay()]
        }));

        const sugarData = last7Days.map(d => ({
            value: sugarLevelByDay[formatDate(d)] || 0,
            label: dayLabels[d.getDay()]
        }));

        // === 2. Build calorieMonthData and sugarMonthData by week of month ===
        const getWeekOfMonth = (date) => Math.ceil(date.getDate() / 7);

        const sumByWeek = (records, dateField, valueField) => {
            const sums = {};
            records.forEach(r => {
                const d = new Date(r[dateField]);
                const weekLabel = 'Week' + getWeekOfMonth(d);
                sums[weekLabel] = (sums[weekLabel] || 0) + r[valueField];
            });
            return sums;
        };

        const mealCalByWeek = sumByWeek(mealRecords, 'date', 'totalCal');
        const sugarLevelByWeek = sumByWeek(sugarRecords, 'timestamp', 'level');

        const weeks = ['Week1', 'Week2', 'Week3', 'Week4', 'Week5', 'Week6', 'Week7', 'Week8', 'Week9', 'Week10', 'Week11', 'Week12', 'Week13', 'Week14'];

        const calorieMonthData = weeks.map(week => ({
            value: mealCalByWeek[week] || 0,
            label: week
        }));

        const sugarMonthData = weeks.map(week => ({
            value: sugarLevelByWeek[week] || 0,
            label: week
        }));

        // === 3. Build todaySummary: sum calory & sugar per meal for today ===
        const todayStr = formatDate(now);

        const sumByMealToday = (records, dateField, valueField, mealField) => {
            const sums = {};
            records.forEach(r => {
                const dStr = formatDate(r[dateField]);
                if (dStr === todayStr) {
                    const mealName = r[mealField] || 'Unknown';
                    sums[mealName] = (sums[mealName] || 0) + r[valueField];
                }
            });
            return sums;
        };

        const mealCalToday = sumByMealToday(mealRecords, 'date', 'totalCal', 'type');
        const sugarLevelToday = sumByMealToday(sugarRecords, 'timestamp', 'level', 'meal');

        const todayMeals = Array.from(new Set([...Object.keys(mealCalToday), ...Object.keys(sugarLevelToday)]));

        const todaySummary = todayMeals.map(meal => ({
            meal,
            calory: mealCalToday[meal] || 0,
            sugar: sugarLevelToday[meal] || 0
        }));

        // === 4. Build monthlySummary: sum calory & sugar per day name for current month ===
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const sumByDayName = (records, dateField, valueField) => {
            const sums = {};
            records.forEach(r => {
                const d = new Date(r[dateField]);
                if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
                    const dayName = dayLabels[d.getDay()];
                    sums[dayName] = (sums[dayName] || 0) + r[valueField];
                }
            });
            return sums;
        };

        const mealCalByDayName = sumByDayName(mealRecords, 'date', 'totalCal');
        const sugarLevelByDayName = sumByDayName(sugarRecords, 'timestamp', 'level');

        const daysSet = new Set([...Object.keys(mealCalByDayName), ...Object.keys(sugarLevelByDayName)]);

        const monthlySummary = Array.from(daysSet).map(day => ({
            day,
            calory: mealCalByDayName[day] || 0,
            sugar: sugarLevelByDayName[day] || 0
        }));

        // Return the structured response
        res.status(200).json({
            calorieData,
            calorieMonthData,
            sugarData,
            sugarMonthData,
            todaySummary,
            monthlySummary,
        });

    } catch (error) {
        console.error('Error in getMealOverview:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getActivityOverview = async (req, res) => {
    try {
        const user = await User.findByUsername(req.user.username);
        const activityRecords = await Activity.findAll(user.id);

        // Day labels to use in calorieData
        const dayLabelsShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const dayLabelsFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const now = new Date();

        // Helper to format date string YYYY-MM-DD
        const formatDate = (d) => {
            const dateObj = d instanceof Date ? d : new Date(d);
            return dateObj.toISOString().slice(0, 10);
        };

        // === 1. Build calorieData for last 7 days (sum burnedCal per day) ===
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date(now);
            d.setDate(now.getDate() - (6 - i)); // 6 days ago to today
            return d;
        });

        // Sum burnedCal per day (date part only)
        const calByDay = {};
        last7Days.forEach(d => {
            calByDay[formatDate(d)] = 0;
        });

        activityRecords.forEach(r => {
            const dateStr = formatDate(r.timestamp);
            if (dateStr in calByDay) {
                calByDay[dateStr] += r.burnedCal;
            }
        });

        const calorieData = last7Days.map(d => ({
            value: Math.floor(calByDay[formatDate(d)] || 0),
            label: dayLabelsShort[d.getDay()]
        }));

        // === 2. Build calorieMonthData grouped by week of the month ===
        const getWeekOfMonth = (date) => Math.ceil(date.getDate() / 7);

        const calByWeek = {};
        activityRecords.forEach(r => {
            const d = new Date(r.timestamp);
            if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
                const weekLabel = `Week ${getWeekOfMonth(d)}`;
                calByWeek[weekLabel] = (calByWeek[weekLabel] || 0) + r.burnedCal;
            }
        });

        // Weeks present in current month (assuming max 4 weeks)
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const calorieMonthData = weeks.map(week => ({
            value: Math.floor(calByWeek[week] || 0),
            label: week
        }));

        // Get start (Sunday) and end (Saturday) dates of current week
        const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - dayOfWeek); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const activityMap = {};

        activityRecords.forEach(r => {
            const d = new Date(r.timestamp);
            if (d >= startOfWeek && d <= endOfWeek) {  // only include current week
                const dayName = dayLabelsFull[d.getDay()];

                if (!activityMap[dayName]) activityMap[dayName] = [];

                activityMap[dayName].push({
                    type: r.activity,
                    duration: r.timePeriod,
                    calories: Math.floor(r.burnedCal),
                });
            }
        });

        // Convert map to array sorted by day order (Sun to Sat)
        const activityData = Object.entries(activityMap)
            .sort(([dayA], [dayB]) => dayLabelsFull.indexOf(dayA) - dayLabelsFull.indexOf(dayB))
            .map(([day, activities]) => ({ day, activities }));

        // Return the full structured response
        res.status(200).json({
            calorieData,
            calorieMonthData,
            activityData
        });

    } catch (error) {
        console.error('Error in getActivityOverview:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const user = await User.findByUsername(req.user.username);

        const notifications = await Notification.findAll(user.id);
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.deleteNotifications = async (req, res) => {
    const { id } = req.body;

    try {
        await Notification.deleteById(id);
        res.status(201).json({ message: 'notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
}



