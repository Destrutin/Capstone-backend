CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  instructions TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE saved_recipes (
  user_id INTEGER
    REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INTEGER
    REFERENCES recipes(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE user_favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  instructions TEXT NOT NULL,
  UNIQUE (user_id, recipe_id)
);

CREATE TABLE meal_plans (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  recipes JSONB NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
