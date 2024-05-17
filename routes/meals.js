const express = require("express");
const axios = require("axios");
const router = express.Router();

const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Route to get all meals
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${MEALDB_BASE_URL}/search.php?s`);
    res.json(response.data);
  } catch (error) {
    console.error("Error searching meal by name:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching meal by name." });
  }
});

// Route to search meal by name
router.get("/search", async (req, res) => {
  const { name } = req.query;
  try {
    const response = await axios.get(`${MEALDB_BASE_URL}/search.php?s=${name}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error searching meal by name:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching meal by name." });
  }
});

// Route to list all meals by first letter
router.get("/list-by-first-letter", async (req, res) => {
  const { letter } = req.query;
  try {
    const response = await axios.get(
      `${MEALDB_BASE_URL}/search.php?f=${letter}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error listing all meals by first letter:", error);
    res.status(500).json({
      error: "An error occurred while listing all meals by first letter.",
    });
  }
});

// Route to lookup full meal details by id
router.get("/lookup", async (req, res) => {
  const { id } = req.query;
  try {
    const response = await axios.get(`${MEALDB_BASE_URL}/lookup.php?i=${id}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error looking up full meal details by id:", error);
    res.status(500).json({
      error: "An error occurred while looking up full meal details by id.",
    });
  }
});

// Route to lookup a single random meal
router.get("/random", async (req, res) => {
  try {
    const response = await axios.get(`${MEALDB_BASE_URL}/random.php`);
    res.json(response.data);
  } catch (error) {
    console.error("Error looking up a single random meal:", error);
    res.status(500).json({
      error: "An error occurred while looking up a single random meal.",
    });
  }
});

// Route to list all meal categories
router.get("/categories", async (req, res) => {
  try {
    const response = await axios.get(`${MEALDB_BASE_URL}/categories.php`);
    res.json(response.data);
  } catch (error) {
    console.error("Error listing all meal categories:", error);
    res
      .status(500)
      .json({ error: "An error occurred while listing all meal categories." });
  }
});

// Route to list all Categories, Area, Ingredients
router.get("/list-all", async (req, res) => {
  const { filter } = req.query;
  try {
    const response = await axios.get(
      `${MEALDB_BASE_URL}/list.php?${filter}=list`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error listing all Categories, Area, Ingredients:", error);
    res.status(500).json({
      error:
        "An error occurred while listing all Categories, Area, Ingredients.",
    });
  }
});

// Route to filter by Category
router.get("/filter-by-category", async (req, res) => {
  const { category } = req.query;
  try {
    const response = await axios.get(
      `${MEALDB_BASE_URL}/filter.php?c=${category}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error filtering by Category:", error);
    res
      .status(500)
      .json({ error: "An error occurred while filtering by Category." });
  }
});

// Route to filter by Area
router.get("/filter-by-area", async (req, res) => {
  const { area } = req.query;
  try {
    const response = await axios.get(`${MEALDB_BASE_URL}/filter.php?a=${area}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error filtering by Area:", error);
    res
      .status(500)
      .json({ error: "An error occurred while filtering by Area." });
  }
});

// Route to filter by main ingredient
router.get("/filter-by-ingredient", async (req, res) => {
  const { ingredient } = req.query;
  try {
    const response = await axios.get(
      `${MEALDB_BASE_URL}/filter.php?i=${ingredient}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error filtering by main ingredient:", error);
    res
      .status(500)
      .json({ error: "An error occurred while filtering by main ingredient." });
  }
});

module.exports = router;
