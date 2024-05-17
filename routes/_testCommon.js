"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Recipe = require("../models/recipe");
const { createToken } = require("../helpers/tokens");

const testRecipeIds = [];
const testUserIds = [];
const testUserFavoriteIds = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM user_favorites");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM recipes");

  const user1 = await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  console.log("User 1:", user1);

  const user2 = await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  console.log("User 2:", user2);

  const user1Id = await User.getUserIdByUsername("u1");
  const user2Id = await User.getUserIdByUsername("u2");
  console.log("User 1 ID:", user1Id);
  console.log("User 2 ID:", user2Id);

  const recipe1 = await Recipe.addOrUpdate({
    id: user1.id,
    userId: user1Id,
    title: "Recipe1",
    category: "Category1",
    instructions: "Instructions1",
  });
  const recipe2 = await Recipe.addOrUpdate({
    id: user2.id,
    userId: user1Id,
    title: "Recipe2",
    category: "Category2",
    instructions: "Instructions2",
  });
  console.log("Recipe 1:", recipe1);
  console.log("Recipe 2:", recipe2);

  const recipe1Id = recipe1.id;
  const recipe2Id = recipe2.id;
  console.log("Recipe 1 ID:", recipe1Id);
  console.log("Recipe 2 ID:", recipe2Id);

  await User.addToFavorites(
    user1Id,
    recipe1Id,
    recipe1.title,
    recipe1.category,
    recipe1.instructions
  );
  console.log("Added recipe 1 to user 1's favorites");

  await User.addToFavorites(
    user2Id,
    recipe2Id,
    recipe2.title,
    recipe2.category,
    recipe2.instructions
  );
  console.log("Added recipe 2 to user 2's favorites");

  testRecipeIds.push(recipe1Id, recipe2Id);
  testUserIds.push(user1Id, user2Id);
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

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testRecipeIds,
  testUserIds,
  u1Token,
  u2Token,
  adminToken,
};
