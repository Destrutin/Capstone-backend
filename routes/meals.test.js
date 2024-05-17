"use strict";

const express = require("express");
const supertest = require("supertest");
const axios = require("axios");
const mealsRouter = require("../routes/meals");

jest.mock("axios");

const app = express();
app.use("/", mealsRouter);

describe("GET /meals", () => {
  test("should return all meals", async () => {
    const mockedMeals = {
      meals: [
        {
          idMeal: "52977",
          strMeal: "Corba",
          strCategory: "Side",
          strArea: "Turkish",
        },
      ],
    };

    axios.get.mockResolvedValue({ data: mockedMeals });

    const response = await supertest(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedMeals);
  });

  test("should handle errors from the MealDB API", async () => {
    axios.get.mockRejectedValue(new Error("API Error"));

    const response = await supertest(app).get("/");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "An error occurred while searching meal by name.",
    });
  });
});

describe("GET /meals/search", () => {
  test("should return the meal with name 'Corba'", async () => {
    const mockedMeal = {
      meals: [
        {
          idMeal: "52977",
          strMeal: "Corba",
          strCategory: "Side",
          strArea: "Turkish",
        },
      ],
    };

    const mockedName = "Corba";
    axios.get.mockResolvedValue({ data: mockedMeal });

    const response = await supertest(app).get(`/search?name=${mockedName}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedMeal);
  });

  test("should handle errors from the MealDB API", async () => {
    const mockedName = "Corba";
    axios.get.mockRejectedValue(new Error("API Error"));

    const response = await supertest(app).get(`/search?name=${mockedName}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "An error occurred while searching meal by name.",
    });
  });
});

describe("GET /meals/list-by-first-letter", () => {
  test("should return all meals starting with letter 'C'", async () => {
    const mockedMeals = {
      meals: [
        {
          idMeal: "52977",
          strMeal: "Corba",
          strCategory: "Side",
          strArea: "Turkish",
        },
        {
          idMeal: "52978",
          strMeal: "Chicken Soup",
          strCategory: "Soup",
          strArea: "American",
        },
      ],
    };

    const mockedLetter = "C";
    axios.get.mockResolvedValue({ data: mockedMeals });

    const response = await supertest(app).get(
      `/list-by-first-letter?letter=${mockedLetter}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedMeals);
  });

  test("should handle errors from the MealDB API", async () => {
    const mockedLetter = "C";
    axios.get.mockRejectedValue(new Error("API Error"));

    const response = await supertest(app).get(
      `/list-by-first-letter?letter=${mockedLetter}`
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "An error occurred while listing all meals by first letter.",
    });
  });
});

describe("GET /meals/lookup", () => {
  test("should return full meal details for id '52977'", async () => {
    const mockedMealDetails = {
      meals: [
        {
          idMeal: "52977",
          strMeal: "Corba",
          strCategory: "Side",
          strArea: "Turkish",
        },
      ],
    };

    const mockedId = "52977";
    axios.get.mockResolvedValue({ data: mockedMealDetails });

    const response = await supertest(app).get(`/lookup?id=${mockedId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedMealDetails);
  });

  test("should handle errors from the MealDB API", async () => {
    const mockedId = "52977";
    axios.get.mockRejectedValue(new Error("API Error"));

    const response = await supertest(app).get(`/lookup?id=${mockedId}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "An error occurred while looking up full meal details by id.",
    });
  });
});

describe("GET /meals/random", () => {
  test("should return a single random meal", async () => {
    const mockedRandomMeal = {
      meals: [
        {
          idMeal: "12345",
          strMeal: "Random Meal",
          strCategory: "Main",
          strArea: "International",
        },
      ],
    };

    axios.get.mockResolvedValue({ data: mockedRandomMeal });

    const response = await supertest(app).get("/random");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedRandomMeal);
  });

  test("should handle errors from the MealDB API", async () => {
    axios.get.mockRejectedValue(new Error("API Error"));

    const response = await supertest(app).get("/random");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "An error occurred while looking up a single random meal.",
    });
  });
});

describe("GET /meals/categories", () => {
  test("should return all meal categories", async () => {
    const mockedCategories = {
      categories: [
        {
          idCategory: "1",
          strCategory: "Beef",
          strCategoryThumb:
            "https://www.themealdb.com/images/category/beef.png",
          strCategoryDescription: "Beef meals",
        },
      ],
    };

    axios.get.mockResolvedValue({ data: mockedCategories });

    const response = await supertest(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedCategories);
  });

  test("should handle errors from the MealDB API", async () => {
    axios.get.mockRejectedValue(new Error("API Error"));

    const response = await supertest(app).get("/categories");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "An error occurred while listing all meal categories.",
    });
  });
});

describe("GET /meals/list-all", () => {
  test("should return all categories when filter is 'c'", async () => {
    const mockedData = {
      meals: [
        { strCategory: "Beef" },
        { strCategory: "Breakfast" },
        { strCategory: "Chicken" },
        { strCategory: "Dessert" },
        { strCategory: "Goat" },
        { strCategory: "Lamb" },
        { strCategory: "Miscellaneous" },
        { strCategory: "Pasta" },
        { strCategory: "Pork" },
        { strCategory: "Seafood" },
        { strCategory: "Side" },
        { strCategory: "Starter" },
        { strCategory: "Vegan" },
        { strCategory: "Vegetarian" },
      ],
    };

    axios.get.mockResolvedValue({ data: mockedData });

    const response = await supertest(app).get("/list-all?filter=c");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedData);
  });

  test("should handle errors from the MealDB API", async () => {
    axios.get.mockRejectedValue(new Error("API Error"));

    const response = await supertest(app).get("/list-all?filter=c");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error:
        "An error occurred while listing all Categories, Area, Ingredients.",
    });
  });
});

describe("GET /meals/filter-by-category", () => {
  test("should return meals filtered by category 'Beef'", async () => {
    const mockedData = {
      meals: [
        {
          strMeal: "Beef and Mustard Pie",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg",
          idMeal: "52874",
        },
        {
          strMeal: "Beef and Oyster pie",
          strMealThumb:
            "https://www.themealdb.com/images/media/meals/wrssvt1511556563.jpg",
          idMeal: "52878",
        },
      ],
    };

    const category = "Beef";
    axios.get.mockResolvedValue({ data: mockedData });

    const response = await supertest(app).get(
      `/filter-by-category?category=${category}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedData);
  });

  test("should handle errors from the MealDB API", async () => {
    const category = "Beef";
    axios.get.mockRejectedValue(new Error("API Error"));

    const response = await supertest(app).get(
      `/filter-by-category?category=${category}`
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "An error occurred while filtering by Category.",
    });
  });
});

describe("GET /meals/filter-by-area", () => {
  test("should return all meals filtered by area 'Turkish'", async () => {
    const mockedMeals = {
      meals: [
        {
          idMeal: "52977",
          strMeal: "Corba",
          strCategory: "Side",
          strArea: "Turkish",
        },
        {
          idMeal: "52978",
          strMeal: "Kumpir",
          strCategory: "Side",
          strArea: "Turkish",
        },
      ],
    };

    const mockedArea = "Turkish";
    axios.get.mockResolvedValue({ data: mockedMeals });

    const response = await supertest(app).get(
      `/filter-by-area?area=${mockedArea}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedMeals);
  });

  test("should handle errors from the MealDB API", async () => {
    const mockedArea = "Turkish";
    axios.get.mockRejectedValue(new Error("API Error"));

    const response = await supertest(app).get(
      `/filter-by-area?area=${mockedArea}`
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "An error occurred while filtering by Area.",
    });
  });
});

describe("GET /meals/filter-by-ingredient", () => {
  test("should return all meals filtered by main ingredient 'Chicken'", async () => {
    const mockedMeals = {
      meals: [
        {
          idMeal: "52772",
          strMeal: "Teriyaki Chicken Casserole",
          strCategory: "Chicken",
          strArea: "Japanese",
        },
        {
          idMeal: "52876",
          strMeal: "Chicken Handi",
          strCategory: "Chicken",
          strArea: "Indian",
        },
      ],
    };

    const mockedIngredient = "Chicken";
    axios.get.mockResolvedValue({ data: mockedMeals });

    const response = await supertest(app).get(
      `/filter-by-ingredient?ingredient=${mockedIngredient}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedMeals);
  });

  test("should handle errors from the MealDB API", async () => {
    const mockedIngredient = "Chicken";
    axios.get.mockRejectedValue(new Error("API Error"));

    const response = await supertest(app).get(
      `/filter-by-ingredient?ingredient=${mockedIngredient}`
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "An error occurred while filtering by main ingredient.",
    });
  });
});
