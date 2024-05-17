const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testUserIds = [];
const testRecipeIds = [];

async function commonBeforeAll() {
  // Clear tables
  await db.query("DELETE FROM user_favorites");
  await db.query("DELETE FROM saved_recipes");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM recipes");

  // Insert test data
  const hashedPassword = await bcrypt.hash("password", BCRYPT_WORK_FACTOR);
  const result = await db.query(
    `INSERT INTO users(username, password, email, first_name, last_name)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    ["testuser", hashedPassword, "test@example.com", "Test", "User"]
  );
  testUserIds.push(result.rows[0].id);

  const recipeResults = await db.query(
    `INSERT INTO recipes (title, category, instructions, user_id)
     VALUES ('Recipe1', 'Category1', 'Instructions for recipe 1', $1),
            ('Recipe2', 'Category2', 'Instructions for recipe 2', $1)
     RETURNING id`,
    [testUserIds[0]]
  );
  testRecipeIds.push(...recipeResults.rows.map((row) => row.id));
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testRecipeIds,
};
