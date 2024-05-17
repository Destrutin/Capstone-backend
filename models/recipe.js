"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Recipe {
  static async create({ title, category, instructions, userId }) {
    if (!userId) {
      throw new Error("userId is required to create a recipe");
    }
    if (!title || !category || !instructions) {
      throw new Error(
        "title, category, and instructions are required to create a recipe"
      );
    }

    const result = await db.query(
      `INSERT INTO recipes (title, category, instructions, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, category, instructions, user_id AS "userId"`,
      [title, category, instructions, userId]
    );
    const recipe = result.rows[0];
    return recipe;
  }

  static async getById(id) {
    const result = await db.query(
      `SELECT id, title, category, instructions, user_id AS "userId"
       FROM recipes
       WHERE id = $1`,
      [id]
    );
    const recipe = result.rows[0];
    if (!recipe) throw new NotFoundError(`No recipe found with id: ${id}`);
    return recipe;
  }

  static async addOrUpdate({ id, userId, title, category, instructions }) {
    if (!userId) {
      throw new Error(
        `User ID is required to associate the recipe with the user`
      );
    }

    let result;

    if (!id) {
      // Recipe is not in the database, so add it
      result = await db.query(
        `INSERT INTO recipes (user_id, title, category, instructions)
         VALUES ($1, $2, $3, $4)
         RETURNING id, user_id AS "userId", title, category, instructions`,
        [userId, title, category, instructions]
      );
    } else {
      // Recipe already exists, update its details
      result = await db.query(
        `UPDATE recipes
         SET title = $3, category = $4, instructions = $5
         WHERE id = $1 AND user_id = $2
         RETURNING id, user_id AS "userId", title, category, instructions`,
        [id, userId, title, category, instructions]
      );
    }

    return result.rows[0];
  }

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM recipes
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    const recipe = result.rows[0];
    if (!recipe) throw new NotFoundError(`No recipe found with id: ${id}`);
  }

  static async exists(userId, recipeId) {
    const result = await db.query(
      `SELECT user_id, recipe_id
       FROM user_favorites
       WHERE user_id = $1 AND recipe_id = $2`,
      [userId, recipeId]
    );
    return result.rows.length > 0;
  }
}

module.exports = Recipe;
