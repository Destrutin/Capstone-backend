"use strict";

const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const MealPlan = require("../models/mealPlan");

const router = express.Router();

// Middleware to authenticate user for all routes in this file
router.use(ensureLoggedIn);

// Create a new meal plan
router.post("/", async (req, res, next) => {
  try {
    const { title, recipes } = req.body;
    const userId = req.locals.user.id;
    const newMealPlan = await MealPlan.create({ title, recipes, userId });
    res.status(201).json({ success: true, mealPlan: newMealPlan });
  } catch (error) {
    next(error);
  }
});

// Get all meal plans for a user
router.get("/", async (req, res, next) => {
  try {
    const userId = req.locals.user.id;
    const mealPlans = await MealPlan.getAll(userId);
    res.status(200).json({ success: true, mealPlans });
  } catch (error) {
    next(error);
  }
});

// Get a specific meal plan by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const mealPlan = await MealPlan.getById(id);
    res.status(200).json({ success: true, mealPlan });
  } catch (error) {
    next(error);
  }
});

// Update a meal plan by ID
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, recipes } = req.body;
    const updatedMealPlan = await MealPlan.update(id, { title, recipes });
    res.status(200).json({ success: true, mealPlan: updatedMealPlan });
  } catch (error) {
    next(error);
  }
});

// Delete a meal plan by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await MealPlan.remove(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
