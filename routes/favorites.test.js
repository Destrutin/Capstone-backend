"use strict";

const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  testRecipeIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /favorites", function () {
  test("works for logged in user", async function () {
    const resp = await request(app)
      .get("/favorites")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      recipes: expect.any(Array),
    });
  });

  test("unauth for non-logged in user", async function () {
    const resp = await request(app).get("/favorites");
    expect(resp.statusCode).toEqual(401);
  });
});

describe("GET /favorites/:recipeId/status", function () {
  test("works for logged in user", async function () {
    const recipeId = testRecipeIds[0];
    const resp = await request(app)
      .get(`/favorites/${recipeId}/status`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ isFavorite: false });
  });

  test("unauth for non-logged in user", async function () {
    const resp = await request(app).get(
      `/favorites/${testRecipeIds[0]}/status`
    );
    expect(resp.statusCode).toEqual(401);
  });
});

describe("POST /favorites/:recipeId", function () {
  test("works for logged in user", async function () {
    const recipeId = testRecipeIds[2];
    const resp = await request(app)
      .post(`/favorites/${recipeId}`)
      .send({
        title: "New Recipe",
        category: "New Category",
        instructions: "New Instructions",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ message: "Recipe added to favorites" });
  });

  test("bad request with missing fields", async function () {
    const recipeId = testRecipeIds[0];
    const resp = await request(app)
      .post(`/favorites/${recipeId}`)
      .send({ title: "New Recipe", category: "New Category" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("unauth for non-logged in user", async function () {
    const resp = await request(app)
      .post(`/favorites/${testRecipeIds[0]}`)
      .send({
        title: "New Recipe",
        category: "New Category",
        instructions: "New Instructions",
      });
    expect(resp.statusCode).toEqual(401);
  });
});

describe("DELETE /favorites/:recipeId", function () {
  test("works for logged in user", async function () {
    const recipeId = testRecipeIds[0];
    const resp = await request(app)
      .delete(`/favorites/${recipeId}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ message: "Recipe removed from favorites" });
  });

  test("unauth for non-logged in user", async function () {
    const resp = await request(app).delete(`/favorites/${testRecipeIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });
});
