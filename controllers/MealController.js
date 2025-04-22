const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const Meal = require('../models/Meal');
const MealItem = require('../models/MealItem');
const IngredientItem = require('../models/IngredientItem');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.getMeals = async (req, res) => {
    try {
        const user = await User.findByUsername(req.user.username);
        const foodItems = await FoodItem.findByType(user.mealType);
        const calorieIntake = Number(user.calorieIntake)

        const breakfastItems = foodItems.filter(item => item.category === "Breakfast");
        const lunchItems = foodItems.filter(item => item.category === "Lunch");
        const snackItems = foodItems.filter(item => item.category === "Snack");
        const dinnerItems = foodItems.filter(item => item.category === "Dinner");

        const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const mealPlan = {};

        for (let day of daysOfWeek) {
            let totalCalories = 0;
            let dailyMeals = {};

            let breakfast = getRandomMeal(breakfastItems);
            totalCalories += breakfast.calorie;
            dailyMeals["breakfast"] = breakfast;

            let lunch = getRandomMeal(lunchItems);
            totalCalories += lunch.calorie;
            dailyMeals["lunch"] = lunch;

            let snack = getRandomMeal(snackItems);
            totalCalories += snack.calorie;
            dailyMeals["snack"] = snack;

            let dinner = getRandomMeal(dinnerItems);
            totalCalories += dinner.calorie;
            dailyMeals["dinner"] = dinner;

            while (totalCalories > calorieIntake) {
                dailyMeals = {};
                totalCalories = 0;

                breakfast = getRandomMeal(breakfastItems);
                totalCalories += breakfast.calorie;
                dailyMeals["breakfast"] = breakfast;

                lunch = getRandomMeal(lunchItems);
                totalCalories += lunch.calorie;
                dailyMeals["lunch"] = lunch;

                snack = getRandomMeal(snackItems);
                totalCalories += snack.calorie;
                dailyMeals["snack"] = snack;

                dinner = getRandomMeal(dinnerItems);
                totalCalories += dinner.calorie;
                dailyMeals["dinner"] = dinner;
            }

            mealPlan[day] = {
                meals: dailyMeals,
                totalCalories: totalCalories
            };
        }
        res.status(200).json({ mealPlan });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getIngredients = async (req, res) => {
    try {
        const { food_ids } = req.body;
        const foodIds = food_ids.split(",");
        let ingredientQuantities = {};

        for (let foodId of foodIds) {
            const ingredients = await IngredientItem.findItemByFood(foodId);

            ingredients.forEach(ingredient => {
                if (ingredientQuantities[ingredient.item]) {
                    ingredientQuantities[ingredient.item].quantity += ingredient.quantity;
                } else {
                    ingredientQuantities[ingredient.item] = {
                        item: ingredient.item,
                        quantity: ingredient.quantity
                    };
                }
            });
        }

        const ingredientData = Object.values(ingredientQuantities);

        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream('grocery_list.pdf'));
        doc.fontSize(18).text('Grocery List', { align: 'center' });
        doc.fontSize(12).moveDown(2);

        const productNameWidth = 300;
        const quantityX = productNameWidth + 50;

        ingredientData.forEach(item => {
            const productName = item.item;
            const quantity = item.quantity;
            doc.text(productName, 50, doc.y, { width: productNameWidth, align: 'left' });
            doc.text(quantity.toString(), quantityX, doc.y, { align: 'right' });
            doc.moveDown(0.5);
        });

        doc.end();

        res.status(200).json({ ingredients: Object.values(ingredientQuantities) });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getIngredientsPdf = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../', 'grocery_list.pdf');

        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="grocery_list.pdf"');
            res.sendFile(filePath);
        } else {
            res.status(404).json({ error: "file not found" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

exports.createFoodItem = async (req, res) => {
    const { name, category, size, calorie, type, image } = req.body;

    try {
        await FoodItem.create(name, category, size, calorie, type, image);
        res.status(201).json({ message: 'Food Item created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getFoodItems = async (req, res) => {
    try {
        const foodItems = await FoodItem.findAll();
        res.status(200).json({ foodItems });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.createMeal = async (req, res) => {const bcrypt = require('bcrypt');
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


    const { name, date, timestamp, totalCal, selectedItems, mealType } = req.body;

    try {
        const mealResult = await Meal.create(name, date, timestamp, totalCal, mealType);
        const mealId = mealResult.insertId;

        for (const item of selectedItems) {
            await MealItem.create(item, mealId);
        }

        res.status(201).json({ message: 'Meal created successfully', mealId });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getAllMeals = async (req, res) => {
    try {
        const mealItems = await Meal.findAll();
        res.status(200).json({ mealItems });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.findByDateRange = async (req, res) => {
    const { fromDate, toDate } = req.body;

    try {
        const mealItems = await Meal.findByDateRange(fromDate, toDate);
        res.status(200).json({ mealItems });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.deleteMeal = async (req, res) => {
    const { id } = req.body;

    try {
        await MealItem.deleteByMealId(id);
        await Meal.deleteById(id);
        res.status(201).json({ message: 'Meal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.cloneMeal = async (req, res) => {
    const { id } = req.body;

    try {
        const meal = await Meal.findById(id);
        const mealItems = await MealItem.findById(id);
        const foodIds = mealItems.map(item => item.food_id);

        const data = {
            totalCal: meal.totalCal,
            foodIds: foodIds
        };

        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

const getRandomMeal = (mealList) => {
    const randomIndex = Math.floor(Math.random() * mealList.length);
    return mealList[randomIndex];
};

