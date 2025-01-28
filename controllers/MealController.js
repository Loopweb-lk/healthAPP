const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const IngredientItem = require('../models/IngredientItem');

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
        res.status(200).json({ ingredients: Object.values(ingredientQuantities) });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

const getRandomMeal = (mealList) => {
    const randomIndex = Math.floor(Math.random() * mealList.length);
    return mealList[randomIndex];
};

