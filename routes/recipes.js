"use strict";

const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const Recipe = require("../models/recipe");

const router = express.Router();

// Middleware to authenticate user for all routes in this file
router.use(ensureLoggedIn);

// Create a new recipe
router.post("/", async (req, res, next) => {
  try {
    const { title, category, instructions } = req.body;
    const userId = req.locals.user.id;
    const newRecipe = await Recipe.create({
      title,
      category,
      instructions,
      userId,
    });
    res.status(201).json({ success: true, recipe: newRecipe });
  } catch (error) {
    next(error);
  }
});

// Get all recipes
router.get("/", async (req, res, next) => {
  try {
    const recipes = await Recipe.getAll();
    res.status(200).json({ success: true, recipes });
  } catch (error) {
    next(error);
  }
});

// Get a specific recipe by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.getById(id);
    res.status(200).json({ success: true, recipe });
  } catch (error) {
    next(error);
  }
});

// Update a recipe by ID
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, instructions } = req.body;
    const updatedRecipe = await Recipe.update(id, {
      title,
      category,
      instructions,
    });
    res.status(200).json({ success: true, recipe: updatedRecipe });
  } catch (error) {
    next(error);
  }
});

// Delete a recipe by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Recipe.remove(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
