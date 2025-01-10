const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');

exports.getMeals = async (req, res) => {
    try {
        const foodItems = await FoodItem.findAll();

        const grains = foodItems.filter(item => item.category === "Grains");
        const proteins = foodItems.filter(item => item.category === "Protein");
        const others = foodItems.filter(item => !["Grains", "Protein"].includes(item.category));

        const selectFoodItems = (minCalories, maxCalories) => {
            const selectedItems = [];
            let totalCalories = 0;
            let mainFood = null;

            const shuffledGrains = grains.sort(() => 0.5 - Math.random());
            const shuffledProteins = proteins.sort(() => 0.5 - Math.random());
            const shuffledOthers = others.sort(() => 0.5 - Math.random());

            if (Math.random() > 0.5 && shuffledGrains.length > 0) {
                mainFood = shuffledGrains[0];
                totalCalories += mainFood.calorie;
            } else if (shuffledProteins.length > 0) {
                mainFood = shuffledProteins[0];
                totalCalories += mainFood.calorie;
            }

            for (const item of [...shuffledOthers, ...shuffledGrains, ...shuffledProteins]) {
                if (totalCalories + item.calorie <= maxCalories) {
                    if (item.name != mainFood.name) {
                        selectedItems.push({
                            name: item.name,
                            calorie: item.calorie,
                        });
                        totalCalories += item.calorie;
                    }
                    if (totalCalories >= minCalories && totalCalories <= maxCalories) break;
                }
            }

            return {
                main: mainFood
                    ? { name: mainFood.name, calorie: mainFood.calorie }
                    : null,
                items: selectedItems,
                calories: totalCalories,
            };
        };


        const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const mealPlan = {};

        daysOfWeek.forEach(day => {
            mealPlan[day] = {
                breakfast: selectFoodItems(300, 500),
                lunch: selectFoodItems(500, 700),
                dinner: selectFoodItems(500, 700)
            };
        });

        res.status(200).json({ mealPlan });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};