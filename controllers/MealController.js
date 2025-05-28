const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const FoodItems = require('../models/FoodItems');
const Meal = require('../models/Meal');
const MealItem = require('../models/MealItem');
const IngredientItem = require('../models/IngredientItem');
const SugerRecord = require('../models/SugerRecord');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function loadLatestMealPlan(userName) {
    const folderPath = path.join(process.cwd(), 'mealPlan');
    if (!fs.existsSync(folderPath)) {
        return null;
    }

    const files = fs.readdirSync(folderPath);

    const userFiles = files
        .filter(f => f.startsWith(userName + '_') && f.endsWith('_mealPlan.json'));

    if (userFiles.length === 0) {
        return null;
    }

    userFiles.sort((a, b) => {
        const dateA = a.split('_')[1];
        const dateB = b.split('_')[1];
        return dateB.localeCompare(dateA);
    });

    const latestFile = userFiles[0];
    const filePath = path.join(folderPath, latestFile);

    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}

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
        let mealPlan = {};

        const today = new Date();
        if (today.getDay() === 5) {
            for (let day of daysOfWeek) {
                let totalCalories = 0;
                let dailyMeals = {};
                console.log(day);

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

            const createdDate = new Date().toISOString().split('T')[0];
            const fileName = `${user.username}_${createdDate}_mealPlan.json`;

            const folderPath = path.join(process.cwd(), 'mealPlan');
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }

            const filePath = path.join(folderPath, fileName);
            fs.writeFile(filePath, JSON.stringify(mealPlan, null, 2), (err) => {
                if (err) {
                    console.error('Error saving meal plan:', err);
                } else {
                    console.log('Meal plan saved successfully:', filePath);
                }
            });
        } else {
            const latestMealPlan = await loadLatestMealPlan(user.username);
            if (latestMealPlan) {
                mealPlan = latestMealPlan;
            } else {
                for (let day of daysOfWeek) {
                    let totalCalories = 0;
                    let dailyMeals = {};
                    console.log(day);

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

                const createdDate = new Date().toISOString().split('T')[0];
                const fileName = `${user.username}_${createdDate}_mealPlan.json`;

                const folderPath = path.join(process.cwd(), 'mealPlan');
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }

                const filePath = path.join(folderPath, fileName);
                fs.writeFile(filePath, JSON.stringify(mealPlan, null, 2), (err) => {
                    if (err) {
                        console.error('Error saving meal plan:', err);
                    } else {
                        console.log('Meal plan saved successfully:', filePath);
                    }
                });
            }
        }
        res.status(200).json({ mealPlan });

    } catch (error) {
        console.log(error);
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
        console.log(error)
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

exports.createFoodItems = async (req, res) => {
    const { name, calorie } = req.body;

    try {
        await FoodItems.create(name, calorie);
        res.status(201).json({ message: 'Meal Item created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getFoods = async (req, res) => {
    try {
        const foodItems = await FoodItem.findAll();
        res.status(200).json({ foodItems });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.getFoodItems = async (req, res) => {
    try {
        const foodItems = await FoodItems.findAll();
        res.status(200).json({ foodItems });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.createMeal = async (req, res) => {
    const { name, date, timestamp, totalCal, selectedItems, mealType } = req.body;

    try {
        const user = await User.findByUsername(req.user.username);
        const mealResult = await Meal.create(name, date, timestamp, totalCal, mealType, user.id);
        const mealId = mealResult.insertId;

        for (const item of selectedItems) {
            await MealItem.create(item, mealId);
        }

        res.status(201).json({ message: 'Meal created successfully', mealId });
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

exports.getAllMeals = async (req, res) => {
    try {
        const user = await User.findByUsername(req.user.username);
        const mealItems = await Meal.findAll(user.id);
        res.status(200).json({ mealItems });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.findByDateRange = async (req, res) => {
    const { fromDate, toDate } = req.body;

    try {
        const user = await User.findByUsername(req.user.username);
        const mealItems = await Meal.findByDateRange(fromDate, toDate, user.id);
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

