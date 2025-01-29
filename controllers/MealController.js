const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const IngredientItem = require('../models/IngredientItem');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.getMeals = async (req, res) => {
    try {
        const foodItems = await FoodItem.findAll();
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

            while (totalCalories > 2500) {
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

const getRandomMeal = (mealList) => {
    const randomIndex = Math.floor(Math.random() * mealList.length);
    return mealList[randomIndex];
};

