Sustainable Nutrition Recommendation System
BSc (Hons) Computing Dissertation Artefact
Arden University

Author: STU142158 – Inna Bains


------------------------------------------------------------
Project Overview
------------------------------------------------------------
This repository contains the complete implementation artefact developed
for the dissertation project “Sustainable Nutrition Management System”.

The system supports sustainable meal planning by integrating:
- nutritional quality
- environmental sustainability indicators
- household ingredient reuse

The prototype demonstrates how heterogeneous datasets can be integrated
into a unified decision-support system capable of generating personalised
weekly meal plans.

The system combines:
- Python data preprocessing pipeline
- MySQL relational database and analytical SQL views
- Spring Boot backend services
- React-based frontend interface


------------------------------------------------------------
System Architecture
------------------------------------------------------------
The system follows a three-tier architecture:

1. Data Layer
   - MySQL relational database
   - analytical SQL views for recommendation scoring
   - staging tables generated from external datasets

2. Application Layer
   - Spring Boot REST API
   - recommendation retrieval
   - recipe and pantry management services

3. Presentation Layer
   - React frontend interface
   - weekly meal planning dashboard
   - recipe details viewer
   - pantry management interface


------------------------------------------------------------
Repository Structure
------------------------------------------------------------
sustainable-nutrition-recommendation-system
│
├── python_pipeline
│     Python ETL scripts used to preprocess raw datasets and
│     generate staging CSV files for the database.
│
├── database_sql
│     MySQL schema, cleaned tables and analytical SQL views
│     used by the recommendation engine.
│
├── backend
│     Spring Boot backend providing REST API endpoints that
│     connect the database and frontend interface.
│
├── frontend
│     React-based user interface used to interact with the
│     recommendation system.
│
└── README.txt


------------------------------------------------------------
Data Sources
------------------------------------------------------------
The system integrates data from several external datasets:

1. UK CoFID 2021
   - Nutritional composition data for food items.

2. Kaggle Recipe Dataset
   - Recipe metadata and ingredient lists.

3. Poore & Nemecek (2018)
   - Environmental impact metrics including:
     • greenhouse gas emissions (CO₂e)
     • land use
     • water use

These datasets are transformed using the Python preprocessing pipeline
before being imported into the relational database.


------------------------------------------------------------
Python Data Preprocessing Pipeline
------------------------------------------------------------
The preprocessing pipeline transforms heterogeneous raw datasets into
structured staging tables suitable for relational storage and analytical
queries.

Scripts included:
- 01_cofid_preprocessing.py
- 02_kaggle_extraction.py
- 03_ingredient_parsing.py
- 04_poore_processing.py

The pipeline performs:
- cleaning nutritional datasets
- parsing ingredient text
- mapping ingredients to food items
- converting environmental metrics to per-100g values

Outputs are exported as CSV files and imported into the MySQL staging layer.


------------------------------------------------------------
Database Layer
------------------------------------------------------------
The MySQL database integrates nutritional composition, sustainability
indicators and recipe data.

Core tables include:
- food_item
- nutrition_fact
- recipe
- recipe_ingredient
- pantry_item
- ingredient_to_food_item
- sustainability_metric

Analytical SQL views include:
- v_recipe_decision_final
- v_recipe_decision_scored
- v_recipe_pantry_reuse
- v_pantry_waste_risk

These views calculate recommendation scores by combining:
- nutritional density
- sustainability indicators
- pantry reuse signals


------------------------------------------------------------
Backend Application (Spring Boot)
------------------------------------------------------------
The backend exposes REST API endpoints used by the frontend interface.

Main responsibilities:
- retrieving recommendation results
- providing recipe details
- managing pantry data
- returning sustainability indicators

Example endpoints:
- /api/recommendations
- /api/recipes/{id}
- /api/pantry
- /api/pantry/waste-risk

The backend communicates directly with the MySQL analytical views.


------------------------------------------------------------
Frontend Interface (React)
------------------------------------------------------------
The frontend application provides:
- weekly meal planning dashboard
- sustainability indicators for each recipe
- pantry management tools
- recipe details viewer

Users can generate a weekly meal plan based on:
- nutritional preferences
- sustainability constraints
- available pantry ingredients


------------------------------------------------------------
Running the System
------------------------------------------------------------
The prototype can be executed locally using:

1. MySQL database
2. Spring Boot backend
3. React frontend

Execution flow:
1. Import database_schema.sql into MySQL
2. Start backend using Spring Boot
3. Start frontend development server
4. Access the application via browser



------------------------------------------------------------
Verification Notes
------------------------------------------------------------
For academic verification purposes, the repository includes:
- full Python preprocessing scripts
- database schema and analytical SQL views
- backend source code
- frontend application code

These components allow the system architecture and implementation
described in the dissertation to be reproduced and evaluated.

