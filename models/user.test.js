"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
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

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("testuser", "password");
    expect(user).toEqual({
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      isAdmin: false,
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nonexistent", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("testuser", "wrongpassword");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", function () {
  const newUser = {
    username: "newuser",
    firstName: "New",
    lastName: "User",
    email: "newuser@example.com",
    isAdmin: false,
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "newpassword",
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = $1", [
      newUser.username,
    ]);
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let user = await User.get("testuser");
    expect(user).toEqual({
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get("nonexistent");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    firstName: "Updated",
    lastName: "User",
    email: "updated@example.com",
  };

  test("works", async function () {
    let updatedUser = await User.update("testuser", updateData);
    expect(updatedUser).toEqual({
      username: "testuser",
      ...updateData,
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.update("nonexistent", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update("testuser", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await User.remove("testuser");
    const res = await db.query("SELECT * FROM users WHERE username = $1", [
      "testuser",
    ]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("nonexistent");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** getFavoriteRecipes */

describe("getFavoriteRecipes", function () {
  test("works", async function () {
    const favoriteRecipes = await User.getFavoriteRecipes(testUserIds[0]);
    expect(favoriteRecipes).toEqual([]);
  });
});

/************************************** addToFavorites */

describe("addToFavorites", function () {
  test("works", async function () {
    await User.addToFavorites(
      testUserIds[0],
      testRecipeIds[0],
      "Favorite Recipe",
      "Favorite Category",
      "Favorite Instructions"
    );
    const favoriteRecipes = await User.getFavoriteRecipes(testUserIds[0]);
    expect(favoriteRecipes.length).toEqual(1);
    expect(favoriteRecipes[0]).toEqual({
      id: testRecipeIds[0],
      title: "Favorite Recipe",
      category: "Favorite Category",
      instructions: "Favorite Instructions",
    });
  });
});

/************************************** removeFromFavorites */

describe("removeFromFavorites", function () {
  test("works", async function () {
    await User.addToFavorites(
      testUserIds[0],
      testRecipeIds[0],
      "Favorite Recipe",
      "Favorite Category",
      "Favorite Instructions"
    );
    let favoriteRecipes = await User.getFavoriteRecipes(testUserIds[0]);
    expect(favoriteRecipes.length).toEqual(1);

    await User.removeFromFavorites(testUserIds[0], testRecipeIds[0]);
    favoriteRecipes = await User.getFavoriteRecipes(testUserIds[0]);
    expect(favoriteRecipes.length).toEqual(0);
  });
});

/************************************** isFavorite */

describe("isFavorite", function () {
  test("works", async function () {
    await User.addToFavorites(
      testUserIds[0],
      testRecipeIds[0],
      "Favorite Recipe",
      "Favorite Category",
      "Favorite Instructions"
    );

    let isFavorite = await User.isFavorite(testUserIds[0], testRecipeIds[0]);
    expect(isFavorite).toBeTruthy();

    await User.removeFromFavorites(testUserIds[0], testRecipeIds[0]);
    isFavorite = await User.isFavorite(testUserIds[0], testRecipeIds[0]);
    expect(isFavorite).toBeFalsy();
  });
});
