"use strict";

const db = require("../db.js");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError.js");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username,
              password,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  static async register({
    username,
    password,
    firstName,
    lastName,
    email,
    isAdmin,
  }) {
    const duplicateCheck = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
      [username, hashedPassword, firstName, lastName, email, isAdmin]
    );

    const user = result.rows[0];

    return user;
  }

  static async findAll() {
    const result = await db.query(
      `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email
           FROM users
           ORDER BY username`
    );

    return result.rows;
  }

  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  static async getUserIdByUsername(username) {
    const result = await db.query(`SELECT id FROM users WHERE username = $1`, [
      username,
    ]);
    if (result.rows.length === 0) {
      throw new NotFoundError(`User not found with username: ${username}`);
    }
    return result.rows[0].id;
  }

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
    });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  static async remove(username) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  static async getFavoriteRecipes(userId) {
    const result = await db.query(
      `SELECT r.id, r.title, r.category, r.instructions
       FROM user_favorites uf
       JOIN recipes r ON uf.recipe_id = r.id
       WHERE uf.user_id = $1`,
      [userId]
    );
    return result.rows;
  }

  static async addToFavorites({userId, recipeId, title, category, instructions}) {
    const result = await db.query(
      // The on conflict portion will update the existing record with the new title, category, and instructions instead of throwing an error. Excluded refers to the values that would have been inserted if there was no conflict.
      `INSERT INTO user_favorites (user_id, recipe_id, title, category, instructions)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, recipe_id) DO UPDATE
       SET title = EXCLUDED.title,
           category = EXCLUDED.category,
           instructions = EXCLUDED.instructions
       RETURNING id`,
      [userId, recipeId, title, category, instructions]
    );
    if (!result.rows[0]) throw new NotFoundError("Recipe not found");
  }

  static async removeFromFavorites(userId, recipeId) {
    const result = await db.query(
      `DELETE FROM user_favorites
       WHERE user_id = $1 AND recipe_id = $2
       RETURNING id`,
      [userId, recipeId]
    );
    if (!result.rows[0]) throw new NotFoundError("Recipe not found");
  }

  static async isFavorite(userId, recipeId) {
    const result = await db.query(
      `SELECT id
       FROM user_favorites
       WHERE user_id = $1 AND recipe_id = $2`,
      [userId, recipeId]
    );
    return result.rows.length > 0;
  }
}

module.exports = User;
