const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("../middleware/auth");
const User = require("../models/user");
const Recipe = require("../models/recipe");

// GET /favorites
// Get favorite recipes for the logged-in user
router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const { userId } = req.query;

    const favoriteRecipes = await User.getFavoriteRecipes(userId);

    return res.json({ recipes: favoriteRecipes });
  } catch (err) {
    return next(err);
  }
});

// GET /favorites/:recipeId/status
// Check if a recipe is favorited by the user
router.get("/:recipeId/status", ensureLoggedIn, async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const userId = req.userId;

    const isFavorite = await User.isFavorite(userId, recipeId);
    return res.json({ isFavorite });
  } catch (err) {
    return next(err);
  }
});

// POST /favorites/:recipeId
// Add a recipe to the user's favorites
router.post("/:recipeId", ensureLoggedIn, async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const userId = req.userId;

    // Check if the recipe exists in the database, if not, add it
    const { title, category, instructions } = req.body;
    if (!title || !category || !instructions) {
      return res
        .status(400)
        .json({ error: "Title, category, and instructions are required." });
    }

    await Recipe.addOrUpdate({
      id: recipeId,
      userId: userId,
      title: title,
      category: category,
      instructions: instructions,
    });

    await User.addToFavorites({
      userId: userId,
      recipeId: recipeId,
      title: title, 
      category: category,
      instructions: instructions});
    return res.status(201).json({ message: "Recipe added to favorites" });
  } catch (err) {
    return next(err);
  }
});

// DELETE /favorites/:recipeId
// Remove a recipe from the user's favorites
router.delete("/:recipeId", ensureLoggedIn, async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const userId = req.userId;

    await User.removeFromFavorites(userId, recipeId);
    return res.json({ message: "Recipe removed from favorites" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
