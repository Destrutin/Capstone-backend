# Recipe Book API

Express.js backend API for managing recipes and user favorites.

## Features

- Allows users to register, log in, and log out.
- Provides endpoints for managing recipes and user favorites.
- Supports CRUD operations for recipes.
- Enables users to add and remove recipes from favorites.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- bcrypt
- JSON Web Tokens

## Getting Started

To run this application locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install dependencies.
4. Set up a PostgreSQL database and update the database configuration in the `.env` file.
5. Run `npm run migrate` to run migrations and set up the database schema.
6. Run `npm start` to start the server.
7. The server will be running on http://localhost:5000.

## API Endpoints

- POST auth/token: Returns a JWT token which can be used for authentication/login.
- POST auth/register: Register a new user.
- GET favorites: Get favorite recipes for the logged-in user.
- GET favorites/:recipeId/status: Check if a recipe is favorited by the user.
- POST favorites/:recipeId: Add a recipe to the user's favorites.
- DELETE favorites/:recipeId: Remove a recipe from the user's favorites.
- PUT /api/recipes/:id: Update an existing recipe.
- DELETE /api/recipes/:id: Delete a recipe.
- GET meals: Get all meals.
- GET meals/search: Search for meals by name.
- GET meals/list-by-first-letter: List all meals by first letter.
- GET meals/lookup: Lookup full meal details by id.
- GET meals/random: Get a single random meal.
- GET meals/categories: List all meal categories.
- GET meals/list-all: List all categories, area, or ingredients.
- GET meals/filter-by-category: Filter meals by category.
- GET meals/filter-by-area: Filter meals by area.
- GET meals/filter-by-ingredient: Filter meals by main ingredient.
- POST users: Adds a new user. Only accessible to admin users.
- GET users: Returns a list of all users.
- GET users/:username: Returns details of a specific user by username.
- GET users/:username/id: Returns the user ID of a specific user by username.
- PATCH users/:username: Updates details of a specific user by username.
- DELETE users/:username: Deletes a specific user by username.

## Folder Structure

- `helpers/`: Contains utility functions for database operations.
- `middleware/`: Contains middleware functions for request processing.
- `models/`: Contains database models for interacting with tables.
- `routes/`: Contains route handlers for different API endpoints.
- `schemas/`: Contains JSON schemas for validating request payloads.
- `.env`: Environment variables configuration file.
- `app.js`: Entry point for the Express application.
- `config.js`: Configuration file for the application.
- `db.js`: Database connection setup file.
- `expressError.js`: Custom error handling middleware.
- `mealdb-schema.sql`: SQL schema file for database tables.
- `mealdb.sql`: SQL script for initial data seeding.
- `package.json`: Node.js package configuration file.
- `server.js`: Entry point for starting the backend server.
