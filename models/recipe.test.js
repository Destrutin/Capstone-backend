"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const Recipe = require("./recipe.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testRecipeIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  test("works", async function () {
    const newRecipe = {
      title: "New Recipe",
      category: "New Category",
      instructions: "Instructions for new recipe",
      userId: testUserIds[0],
    };
    let recipe = await Recipe.create(newRecipe);
    expect(recipe).toEqual({ id: expect.any(Number), ...newRecipe });

    const result = await db.query(
      `SELECT id, title, category, instructions, user_id AS "userId"
       FROM recipes
       WHERE id = $1`,
      [recipe.id]
    );
    expect(result.rows).toEqual([
      {
        id: recipe.id,
        title: "New Recipe",
        category: "New Category",
        instructions: "Instructions for new recipe",
        userId: testUserIds[0],
      },
    ]);
  });
});

/************************************** getAll */

describe("getAll", function () {
  test("works", async function () {
    let recipes = await Recipe.getAll();
    expect(recipes).toEqual([
      {
        id: testRecipeIds[0],
        title: "Recipe1",
        category: "Category1",
        instructions: "Instructions for recipe 1",
        userId: testUserIds[0],
      },
      {
        id: testRecipeIds[1],
        title: "Recipe2",
        category: "Category2",
        instructions: "Instructions for recipe 2",
        userId: testUserIds[0],
      },
    ]);
  });
});

/************************************** getById */

describe("getById", function () {
  test("works", async function () {
    let recipe = await Recipe.getById(testRecipeIds[0]);
    expect(recipe).toEqual({
      id: testRecipeIds[0],
      title: "Recipe1",
      category: "Category1",
      instructions: "Instructions for recipe 1",
      userId: testUserIds[0],
    });
  });

  test("not found if no such recipe", async function () {
    try {
      await Recipe.getById(-1);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** addOrUpdate */

describe("addOrUpdate", function () {
  const updatedRecipeData = {
    title: "Updated Recipe",
    category: "Updated Category",
    instructions: "Updated instructions",
  };

  test("works for new recipe", async function () {
    const result = await Recipe.addOrUpdate({
      id: null, // Use null for new recipe
      userId: testUserIds[0],
      ...updatedRecipeData,
    });

    const fetchedRecipe = await db.query(
      `SELECT title, category, instructions
         FROM recipes
         WHERE id = $1`,
      [result.id]
    );

    expect(fetchedRecipe.rows).toEqual([
      {
        title: "Updated Recipe",
        category: "Updated Category",
        instructions: "Updated instructions",
      },
    ]);
  });

  test("works for existing recipe", async function () {
    const result = await Recipe.addOrUpdate({
      id: testRecipeIds[0],
      userId: testUserIds[0],
      ...updatedRecipeData,
    });

    const fetchedRecipe = await db.query(
      `SELECT title, category, instructions
         FROM recipes
         WHERE id = $1`,
      [testRecipeIds[0]]
    );

    expect(fetchedRecipe.rows).toEqual([
      {
        title: "Updated Recipe",
        category: "Updated Category",
        instructions: "Updated instructions",
      },
    ]);
  });

  test("throws error if userId not provided", async function () {
    try {
      await Recipe.addOrUpdate({
        id: null,
        userId: null,
        ...updatedRecipeData,
      });
      fail();
    } catch (err) {
      expect(err.message).toEqual(
        "User ID is required to associate the recipe with the user"
      );
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Recipe.remove(testRecipeIds[0]);
    const res = await db.query("SELECT id FROM recipes WHERE id=$1", [
      testRecipeIds[0],
    ]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such recipe", async function () {
    try {
      await Recipe.remove(-1);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** exists */

describe("exists", function () {
  test("returns false if recipe is not favorited", async function () {
    const exists = await Recipe.exists(testUserIds[0], testRecipeIds[0]);
    expect(exists).toBe(false);
  });
});
