Sustainable Nutrition Recommendation System
Database Layer (MySQL)
------------------------------------------------------------

This directory contains the MySQL database schema, staging tables,
cleaned tables and analytical SQL views used by the Sustainable
Nutrition Management System. The database integrates nutritional,
environmental and recipe data into a unified relational model that
supports the rule-based recommendation engine.


1. Purpose of the Database Layer
------------------------------------------------------------
The database provides the structured foundation for the system by:

- storing nutritional, sustainability and recipe data
- integrating heterogeneous datasets into a consistent schema
- supporting pantry-aware ingredient reuse
- enabling transparent, explainable recommendation scoring through SQL views

The relational model ensures data integrity and traceability across all
components of the artefact.


2. Schema Overview
------------------------------------------------------------
Core operational tables:

food_item
    Food identifiers, names, categories and base units.

nutrition_fact
    Nutritional composition per 100g (energy, protein, fat, carbs,
    sugar, fibre, salt).

recipe
    Recipe metadata including title, category and description.

recipe_ingredient
    One row per ingredient used in a recipe, including quantity, unit,
    ingredient_core and mapped food item where available.

pantry_item
    User pantry entries including quantity, unit and expiry date.

ingredient_to_food_item
    Mapping table linking parsed ingredient_core values to CoFID items.

sustainability_metric
    Environmental impact metrics per 100g (CO2e, land use, water use).


3. Staging Tables (from Python Pipeline)
------------------------------------------------------------
The following staging tables are populated directly from the Python
preprocessing scripts:

stg_food_item
stg_nutrition
stg_recipe_kaggle
stg_recipe_ingredient_kaggle
stg_recipe_ingredient_parsed
stg_poore_product
stg_food_poore_map

These tables act as an intermediate validation layer before data is
transformed into the final clean tables.


4. Analytical SQL Views
------------------------------------------------------------
The recommendation engine relies on several analytical SQL views that
combine nutritional, environmental and pantry data.

Key views:

v_recipe_decision_final
    Joins recipes, ingredients, nutrition and sustainability metrics.
    Computes per-recipe indicators such as energy, protein density,
    CO2e band, pantryMatches and decisionScore.

v_recipe_decision_scored
    Applies rule-based scoring logic to rank recipes.

v_recipe_pantry_reuse
    Highlights recipes that reuse pantry items and incorporates
    waste-risk information.

v_pantry_waste_risk
    Computes waste-risk scores based on expiry dates and ingredient usage.

These views implement the core logic used by the backend to generate
transparent, explainable recommendations.


End of README
------------------------------------------------------------
