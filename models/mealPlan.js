"use strict";

const db = require("../db");

class MealPlan {
  /** Create a new meal plan
   *
   * Returns { id, title, recipes, userId }
   */
  static async create({ title, recipes, userId }) {
    const result = await db.query(
      `INSERT INTO meal_plans (title, recipes, user_id)
       VALUES ($1, $2, $3)
       RETURNING id, title, recipes, user_id AS "userId"`,
      [title, recipes, userId]
    );
    return result.rows[0];
  }

  /** Get all meal plans for a user
   *
   * Returns [{ id, title, recipes, userId }, ...]
   */
  static async getAll(userId) {
    const result = await db.query(
      `SELECT id, title, recipes, user_id AS "userId"
       FROM meal_plans
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows;
  }

  /** Get a meal plan by ID
   *
   * Returns { id, title, recipes, userId }
   */
  static async getById(id) {
    const result = await db.query(
      `SELECT id, title, recipes, user_id AS "userId"
       FROM meal_plans
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  /** Update a meal plan by ID
   *
   * Returns { id, title, recipes, userId }
   */
  static async update(id, data) {
    const result = await db.query(
      `UPDATE meal_plans
       SET title = $1, recipes = $2
       WHERE id = $3
       RETURNING id, title, recipes, user_id AS "userId"`,
      [data.title, data.recipes, id]
    );
    return result.rows[0];
  }

  /** Delete a meal plan by ID */
  static async remove(id) {
    await db.query(
      `DELETE FROM meal_plans
       WHERE id = $1`,
      [id]
    );
  }
}

module.exports = MealPlan;
