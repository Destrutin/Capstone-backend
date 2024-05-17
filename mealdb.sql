\echo 'Delete and recreate mealdb db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE mealdb;
CREATE DATABASE mealdb;
\connect mealdb

\i mealdb-schema.sql
\i mealdb-seed.sql

\echo 'Delete and recreate mealdb_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE mealdb_test;
CREATE DATABASE mealdb_test;
\connect mealdb_test

\i mealdb-schema.sql
