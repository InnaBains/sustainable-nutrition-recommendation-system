Sustainable Nutrition Recommendation System
Python Data Preprocessing Pipeline
------------------------------------------------------------

This directory contains the full Python ETL (Extract–Transform–Load)
pipeline used to prepare the external datasets for the Sustainable
Nutrition Management System. The pipeline transforms heterogeneous raw
data into structured staging tables suitable for relational storage and
analytical SQL views in MySQL.

These scripts generate all CSV files used by the backend recommendation
engine.


Pipeline Overview
------------------------------------------------------------
The preprocessing workflow consists of four scripts:

01_cofid_preprocessing.py
    Cleans and extracts nutritional composition data from the UK
    CoFID 2021 dataset.

02_kaggle_extraction.py
    Extracts recipe metadata and ingredient lists from the Kaggle
    dataset (subset of 1,000 recipes).

03_ingredient_parsing.py
    Parses free-text ingredient strings into structured components
    (quantity, unit, ingredient core).

04_poore_processing.py
    Processes Poore & Nemecek (2018) lifecycle assessment data and
    converts metrics to per-100g values.

Each script runs independently and writes its output to the data_out/
directory.


Data Sources
------------------------------------------------------------
1. UK CoFID 2021 (Nutritional Composition)
   - Provides energy, protein, fat, carbohydrates, sugar, fibre and salt.
   - Cleaned and normalised into:
       stg_food_item.csv
       stg_nutrition.csv

2. Kaggle Recipe Dataset
   - Contains 64,000+ recipes (subset of 1,000 used due to MySQL limits).
   - Extracted into:
       stg_recipe_kaggle.csv
       stg_recipe_ingredient_kaggle.csv

3. Poore & Nemecek (2018)
   - Provides environmental impact metrics:
       CO2e emissions
       land use
       water use
   - Converted to per-100g values in:
       stg_poore_product.csv


Output Files (Staging Layer)
------------------------------------------------------------
The pipeline generates the following CSV files:

stg_food_item.csv
    Clean list of food items with categories and base units.

stg_nutrition.csv
    Nutritional composition per 100g.

stg_recipe_kaggle.csv
    Recipe metadata (1,000 recipes).

stg_recipe_ingredient_kaggle.csv
    Raw ingredient rows (8,017 rows).

stg_recipe_ingredient_parsed.csv
    Parsed ingredient quantities, units and core names.

stg_poore_product.csv
    Environmental metrics per 100g.

stg_food_poore_map.csv
    Mapping between CoFID foods and Poore categories (if generated).

These files are imported into MySQL staging tables before being
transformed into the final operational schema.


Script Details
------------------------------------------------------------
01_cofid_preprocessing.py
    - Cleans numeric fields (handles “tr”, “<0.1”, “N/A”, Unicode dashes)
    - Merges proximates with sodium data
    - Calculates salt using UK conversion factor (×2.5)
    - Deduplicates rows based on completeness

02_kaggle_extraction.py
    - Parses Python list strings using ast.literal_eval
    - Normalises recipe metadata
    - Flattens ingredient arrays into row-level records
    - Limits dataset to 1,000 recipes for phpMyAdmin compatibility

03_ingredient_parsing.py
    - Handles fractions (1/2, 1 1/2, 3/4)
    - Normalises units (tsp, tbsp, g, ml, etc.)
    - Extracts ingredient_core for mapping
    - Reports parsing coverage (quantity %, unit %)

04_poore_processing.py
    - Detects multi-row headers in Excel file
    - Extracts CO2e, land use and water use
    - Converts functional units to per-100g basis
    - Produces 40+ mapped product categories


Dependencies
------------------------------------------------------------
Python 3.9 or higher

Required libraries:
    pandas
    numpy
    openpyxl

Install dependencies:
    pip install pandas numpy openpyxl


Running the Pipeline
------------------------------------------------------------
Run scripts individually:

    python 01_cofid_preprocessing.py
    python 02_kaggle_extraction.py
    python 03_ingredient_parsing.py
    python 04_poore_processing.py

All outputs will appear in the data_out/ directory.


Dissertation Context
------------------------------------------------------------
This pipeline forms the foundation of the Sustainable Nutrition
Recommendation System by:

- cleaning and harmonising heterogeneous datasets
- enabling relational integration in MySQL
- supporting analytical SQL views used by the backend
- providing structured data for the React frontend

The pipeline is fully documented for academic verification and
reproducibility.
