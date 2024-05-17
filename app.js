"use strict";

/** Express app for MealDB. */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const auth = require("./routes/auth");
const recipes = require("./routes/recipes");
const users = require("./routes/users");
const meals = require("./routes/meals");
const favorites = require("./routes/favorites");
const mealPlans = require("./routes/mealPlans");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", auth);
app.use("/recipes", recipes);
app.use("/users", users);
app.use("/meals", meals);
app.use("/favorites", favorites);
app.use("/meal-plans", mealPlans);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
