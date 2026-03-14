-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 14, 2026 at 09:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sustainable_nutrition`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_pantry_waste_risk`
-- (See below for the actual view)
--
CREATE TABLE `v_pantry_waste_risk` (
`pantry_item_id` int(11)
,`food_item_id` int(11)
,`food_name` varchar(255)
,`perishability_code` varchar(10)
,`quantity` decimal(10,2)
,`unit` varchar(20)
,`expires_on` date
,`waste_risk_score` int(1)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_recipe_decision_features`
-- (See below for the actual view)
--
CREATE TABLE `v_recipe_decision_features` (
`recipe_id` int(11)
,`recipe_name` varchar(255)
,`ingredients_total` bigint(21)
,`pantry_matches` bigint(21)
,`reuse_score` decimal(24,3)
,`waste_priority_score` decimal(32,0)
,`co2e_total_kg` decimal(20,8)
,`land_total_m2` decimal(20,8)
,`water_total_l` decimal(20,8)
,`has_sustainability` int(1)
,`uses_pantry` int(1)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_recipe_decision_final`
-- (See below for the actual view)
--
CREATE TABLE `v_recipe_decision_final` (
`recipe_id` int(11)
,`recipe_name` varchar(255)
,`ingredients_total` bigint(21)
,`pantry_matches` bigint(21)
,`reuse_score` decimal(24,3)
,`waste_priority_score` decimal(32,0)
,`co2e_total_kg` decimal(20,8)
,`land_total_m2` decimal(20,8)
,`water_total_l` decimal(20,8)
,`has_sustainability` int(1)
,`uses_pantry` int(1)
,`co2e_band` varchar(4)
,`decision_score` decimal(39,3)
,`recipe_mass_g` decimal(32,2)
,`energy_kcal_per_100g_recipe` decimal(55,12)
,`protein_g_per_100g_recipe` decimal(55,12)
,`fat_g_per_100g_recipe` decimal(55,12)
,`carbs_g_per_100g_recipe` decimal(55,12)
,`sugar_g_per_100g_recipe` decimal(55,12)
,`fibre_g_per_100g_recipe` decimal(55,12)
,`salt_g_per_100g_recipe` decimal(55,14)
,`has_nutrition_density` int(1)
,`nutrition_reliable` int(1)
,`salt_band` varchar(4)
,`sugar_band` varchar(4)
,`energy_band` varchar(4)
,`decision_score_nutrition` decimal(40,3)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_recipe_decision_scored`
-- (See below for the actual view)
--
CREATE TABLE `v_recipe_decision_scored` (
`recipe_id` int(11)
,`recipe_name` varchar(255)
,`ingredients_total` bigint(21)
,`pantry_matches` bigint(21)
,`reuse_score` decimal(24,3)
,`waste_priority_score` decimal(32,0)
,`co2e_total_kg` decimal(20,8)
,`land_total_m2` decimal(20,8)
,`water_total_l` decimal(20,8)
,`has_sustainability` int(1)
,`uses_pantry` int(1)
,`co2e_band` varchar(4)
,`decision_score` decimal(39,3)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_recipe_decision_scored_plus_nutrition`
-- (See below for the actual view)
--
CREATE TABLE `v_recipe_decision_scored_plus_nutrition` (
`recipe_id` int(11)
,`recipe_name` varchar(255)
,`ingredients_total` bigint(21)
,`pantry_matches` bigint(21)
,`reuse_score` decimal(24,3)
,`waste_priority_score` decimal(32,0)
,`co2e_total_kg` decimal(20,8)
,`land_total_m2` decimal(20,8)
,`water_total_l` decimal(20,8)
,`has_sustainability` int(1)
,`uses_pantry` int(1)
,`co2e_band` varchar(4)
,`decision_score` decimal(39,3)
,`servings_raw` int(11)
,`servings_effective` int(11)
,`energy_kcal_per_serving` decimal(50,12)
,`protein_g_per_serving` decimal(50,12)
,`fat_g_per_serving` decimal(50,12)
,`carbs_g_per_serving` decimal(50,12)
,`sugar_g_per_serving` decimal(50,12)
,`fibre_g_per_serving` decimal(50,12)
,`salt_g_per_serving` decimal(50,14)
,`has_nutrition` int(1)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_recipe_decision_with_nutrition`
-- (See below for the actual view)
--
CREATE TABLE `v_recipe_decision_with_nutrition` (
`recipe_id` int(11)
,`recipe_name` varchar(255)
,`ingredients_total` bigint(21)
,`pantry_matches` bigint(21)
,`reuse_score` decimal(24,3)
,`waste_priority_score` decimal(32,0)
,`co2e_total_kg` decimal(20,8)
,`land_total_m2` decimal(20,8)
,`water_total_l` decimal(20,8)
,`has_sustainability` int(1)
,`uses_pantry` int(1)
,`co2e_band` varchar(4)
,`decision_score` decimal(39,3)
,`recipe_mass_g` decimal(32,2)
,`energy_kcal_per_100g_recipe` decimal(55,12)
,`protein_g_per_100g_recipe` decimal(55,12)
,`fat_g_per_100g_recipe` decimal(55,12)
,`carbs_g_per_100g_recipe` decimal(55,12)
,`sugar_g_per_100g_recipe` decimal(55,12)
,`fibre_g_per_100g_recipe` decimal(55,12)
,`salt_g_per_100g_recipe` decimal(55,14)
,`has_nutrition_density` int(1)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_recipe_mass_and_nutrition`
-- (See below for the actual view)
--
CREATE TABLE `v_recipe_mass_and_nutrition` (
`recipe_id` int(11)
,`recipe_mass_g` decimal(32,2)
,`energy_kcal_total` decimal(46,8)
,`protein_g_total` decimal(46,8)
,`fat_g_total` decimal(46,8)
,`carbs_g_total` decimal(46,8)
,`sugar_g_total` decimal(46,8)
,`fibre_g_total` decimal(46,8)
,`salt_g_total` decimal(46,10)
,`energy_kcal_per_100g_recipe` decimal(55,12)
,`protein_g_per_100g_recipe` decimal(55,12)
,`fat_g_per_100g_recipe` decimal(55,12)
,`carbs_g_per_100g_recipe` decimal(55,12)
,`sugar_g_per_100g_recipe` decimal(55,12)
,`fibre_g_per_100g_recipe` decimal(55,12)
,`salt_g_per_100g_recipe` decimal(55,14)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_recipe_nutrition`
-- (See below for the actual view)
--
CREATE TABLE `v_recipe_nutrition` (
`recipe_id` int(11)
,`energy_kcal_total` decimal(46,8)
,`protein_g_total` decimal(46,8)
,`fat_g_total` decimal(46,8)
,`carbs_g_total` decimal(46,8)
,`sugar_g_total` decimal(46,8)
,`fibre_g_total` decimal(46,8)
,`salt_g_total` decimal(46,10)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_recipe_nutrition_per_serving`
-- (See below for the actual view)
--
CREATE TABLE `v_recipe_nutrition_per_serving` (
`recipe_id` int(11)
,`recipe_name` varchar(255)
,`servings_raw` int(11)
,`servings_effective` int(11)
,`energy_kcal_total` decimal(46,8)
,`protein_g_total` decimal(46,8)
,`fat_g_total` decimal(46,8)
,`carbs_g_total` decimal(46,8)
,`sugar_g_total` decimal(46,8)
,`fibre_g_total` decimal(46,8)
,`salt_g_total` decimal(46,10)
,`energy_kcal_per_serving` decimal(50,12)
,`protein_g_per_serving` decimal(50,12)
,`fat_g_per_serving` decimal(50,12)
,`carbs_g_per_serving` decimal(50,12)
,`sugar_g_per_serving` decimal(50,12)
,`fibre_g_per_serving` decimal(50,12)
,`salt_g_per_serving` decimal(50,14)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_recipe_nutrition_quality`
-- (See below for the actual view)
--
CREATE TABLE `v_recipe_nutrition_quality` (
`recipe_id` int(11)
,`recipe_mass_g` decimal(32,2)
,`nutrition_reliable` int(1)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_recipe_pantry_match`
-- (See below for the actual view)
--
CREATE TABLE `v_recipe_pantry_match` (
`recipe_id` int(11)
,`food_item_id` int(11)
,`ingredient_instances` bigint(21)
,`waste_risk_score` int(1)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_recipe_pantry_reuse`
-- (See below for the actual view)
--
CREATE TABLE `v_recipe_pantry_reuse` (
`recipe_id` int(11)
,`recipe_name` varchar(255)
,`ingredients_total` bigint(21)
,`pantry_matches` bigint(21)
,`reuse_score` decimal(24,3)
,`waste_priority_score` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_recipe_servings_effective`
-- (See below for the actual view)
--
CREATE TABLE `v_recipe_servings_effective` (
`recipe_id` int(11)
,`recipe_name` varchar(255)
,`servings_raw` int(11)
,`servings_effective` int(11)
);

-- --------------------------------------------------------

--
-- Structure for view `v_pantry_waste_risk`
--
DROP TABLE IF EXISTS `v_pantry_waste_risk`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_pantry_waste_risk`  AS SELECT `pi`.`pantry_item_id` AS `pantry_item_id`, `pi`.`food_item_id` AS `food_item_id`, `fi`.`name` AS `food_name`, `fi`.`perishability_code` AS `perishability_code`, `pi`.`quantity` AS `quantity`, `pi`.`unit` AS `unit`, `pi`.`expires_on` AS `expires_on`, CASE WHEN `pi`.`expires_on` is null THEN 0 WHEN `pi`.`expires_on` < curdate() THEN 3 WHEN `pi`.`expires_on` <= curdate() + interval 2 day THEN 3 WHEN `pi`.`expires_on` <= curdate() + interval 5 day THEN 2 ELSE 1 END AS `waste_risk_score` FROM (`pantry_item` `pi` join `food_item` `fi` on(`fi`.`food_item_id` = `pi`.`food_item_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `v_recipe_decision_features`
--
DROP TABLE IF EXISTS `v_recipe_decision_features`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_recipe_decision_features`  AS SELECT `r`.`recipe_id` AS `recipe_id`, `r`.`name` AS `recipe_name`, `pr`.`ingredients_total` AS `ingredients_total`, `pr`.`pantry_matches` AS `pantry_matches`, `pr`.`reuse_score` AS `reuse_score`, `pr`.`waste_priority_score` AS `waste_priority_score`, `rs`.`co2e_total_kg` AS `co2e_total_kg`, `rs`.`land_total_m2` AS `land_total_m2`, `rs`.`water_total_l` AS `water_total_l`, CASE WHEN `rs`.`recipe_id` is null THEN 0 ELSE 1 END AS `has_sustainability`, CASE WHEN `pr`.`pantry_matches` > 0 THEN 1 ELSE 0 END AS `uses_pantry` FROM ((`recipe` `r` left join `v_recipe_pantry_reuse` `pr` on(`pr`.`recipe_id` = `r`.`recipe_id`)) left join `recipe_sustainability` `rs` on(`rs`.`recipe_id` = `r`.`recipe_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `v_recipe_decision_final`
--
DROP TABLE IF EXISTS `v_recipe_decision_final`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_recipe_decision_final`  AS SELECT `d`.`recipe_id` AS `recipe_id`, `d`.`recipe_name` AS `recipe_name`, `d`.`ingredients_total` AS `ingredients_total`, `d`.`pantry_matches` AS `pantry_matches`, `d`.`reuse_score` AS `reuse_score`, `d`.`waste_priority_score` AS `waste_priority_score`, `d`.`co2e_total_kg` AS `co2e_total_kg`, `d`.`land_total_m2` AS `land_total_m2`, `d`.`water_total_l` AS `water_total_l`, `d`.`has_sustainability` AS `has_sustainability`, `d`.`uses_pantry` AS `uses_pantry`, `d`.`co2e_band` AS `co2e_band`, `d`.`decision_score` AS `decision_score`, `d`.`recipe_mass_g` AS `recipe_mass_g`, `d`.`energy_kcal_per_100g_recipe` AS `energy_kcal_per_100g_recipe`, `d`.`protein_g_per_100g_recipe` AS `protein_g_per_100g_recipe`, `d`.`fat_g_per_100g_recipe` AS `fat_g_per_100g_recipe`, `d`.`carbs_g_per_100g_recipe` AS `carbs_g_per_100g_recipe`, `d`.`sugar_g_per_100g_recipe` AS `sugar_g_per_100g_recipe`, `d`.`fibre_g_per_100g_recipe` AS `fibre_g_per_100g_recipe`, `d`.`salt_g_per_100g_recipe` AS `salt_g_per_100g_recipe`, `d`.`has_nutrition_density` AS `has_nutrition_density`, `q`.`nutrition_reliable` AS `nutrition_reliable`, CASE WHEN `d`.`salt_g_per_100g_recipe` is null THEN 'NONE' WHEN `d`.`salt_g_per_100g_recipe` <= 0.0275 THEN 'LOW' WHEN `d`.`salt_g_per_100g_recipe` <= 1.87861806311208 THEN 'MED' ELSE 'HIGH' END AS `salt_band`, CASE WHEN `d`.`sugar_g_per_100g_recipe` is null THEN 'NONE' WHEN `d`.`sugar_g_per_100g_recipe` <= 0.6000 THEN 'LOW' WHEN `d`.`sugar_g_per_100g_recipe` <= 3.7750 THEN 'MED' ELSE 'HIGH' END AS `sugar_band`, CASE WHEN `d`.`energy_kcal_per_100g_recipe` is null THEN 'NONE' WHEN `d`.`energy_kcal_per_100g_recipe` <= 324.923076923077 THEN 'LOW' WHEN `d`.`energy_kcal_per_100g_recipe` <= 599.333333333333 THEN 'MED' ELSE 'HIGH' END AS `energy_band`, `d`.`decision_score`+ CASE WHEN `q`.`nutrition_reliable` = 0 THEN 0 ELSE CASE WHEN `d`.`salt_g_per_100g_recipe` is null THEN 0 WHEN `d`.`salt_g_per_100g_recipe` <= 0.0275 THEN 1 WHEN `d`.`salt_g_per_100g_recipe` <= 1.87861806311208 THEN 0 ELSE -2 END+ CASE WHEN `d`.`sugar_g_per_100g_recipe` is null THEN 0 WHEN `d`.`sugar_g_per_100g_recipe` <= 0.6000 THEN 1 WHEN `d`.`sugar_g_per_100g_recipe` <= 3.7750 THEN 0 ELSE -2 END+ CASE WHEN `d`.`energy_kcal_per_100g_recipe` is null THEN 0 WHEN `d`.`energy_kcal_per_100g_recipe` <= 324.923076923077 THEN 1 WHEN `d`.`energy_kcal_per_100g_recipe` <= 599.333333333333 THEN 0 ELSE -1 END END AS `decision_score_nutrition` FROM (`v_recipe_decision_with_nutrition` `d` left join `v_recipe_nutrition_quality` `q` on(`q`.`recipe_id` = `d`.`recipe_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `v_recipe_decision_scored`
--
DROP TABLE IF EXISTS `v_recipe_decision_scored`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_recipe_decision_scored`  AS SELECT `f`.`recipe_id` AS `recipe_id`, `f`.`recipe_name` AS `recipe_name`, `f`.`ingredients_total` AS `ingredients_total`, `f`.`pantry_matches` AS `pantry_matches`, `f`.`reuse_score` AS `reuse_score`, `f`.`waste_priority_score` AS `waste_priority_score`, `f`.`co2e_total_kg` AS `co2e_total_kg`, `f`.`land_total_m2` AS `land_total_m2`, `f`.`water_total_l` AS `water_total_l`, `f`.`has_sustainability` AS `has_sustainability`, `f`.`uses_pantry` AS `uses_pantry`, CASE WHEN `f`.`co2e_total_kg` is null OR `f`.`co2e_total_kg` = 0 THEN 'NONE' WHEN `f`.`co2e_total_kg` <= 0.00008175 THEN 'LOW' WHEN `f`.`co2e_total_kg` <= 0.00037920 THEN 'MED' ELSE 'HIGH' END AS `co2e_band`, `f`.`waste_priority_score`* 10 + `f`.`reuse_score` * 5 + CASE WHEN `f`.`co2e_total_kg` is null OR `f`.`co2e_total_kg` = 0 THEN 0 WHEN `f`.`co2e_total_kg` <= 0.00008175 THEN 2 WHEN `f`.`co2e_total_kg` <= 0.00037920 THEN 1 ELSE -1 END AS `decision_score` FROM `v_recipe_decision_features` AS `f` ;

-- --------------------------------------------------------

--
-- Structure for view `v_recipe_decision_scored_plus_nutrition`
--
DROP TABLE IF EXISTS `v_recipe_decision_scored_plus_nutrition`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_recipe_decision_scored_plus_nutrition`  AS SELECT `d`.`recipe_id` AS `recipe_id`, `d`.`recipe_name` AS `recipe_name`, `d`.`ingredients_total` AS `ingredients_total`, `d`.`pantry_matches` AS `pantry_matches`, `d`.`reuse_score` AS `reuse_score`, `d`.`waste_priority_score` AS `waste_priority_score`, `d`.`co2e_total_kg` AS `co2e_total_kg`, `d`.`land_total_m2` AS `land_total_m2`, `d`.`water_total_l` AS `water_total_l`, `d`.`has_sustainability` AS `has_sustainability`, `d`.`uses_pantry` AS `uses_pantry`, `d`.`co2e_band` AS `co2e_band`, `d`.`decision_score` AS `decision_score`, `n`.`servings_raw` AS `servings_raw`, `n`.`servings_effective` AS `servings_effective`, `n`.`energy_kcal_per_serving` AS `energy_kcal_per_serving`, `n`.`protein_g_per_serving` AS `protein_g_per_serving`, `n`.`fat_g_per_serving` AS `fat_g_per_serving`, `n`.`carbs_g_per_serving` AS `carbs_g_per_serving`, `n`.`sugar_g_per_serving` AS `sugar_g_per_serving`, `n`.`fibre_g_per_serving` AS `fibre_g_per_serving`, `n`.`salt_g_per_serving` AS `salt_g_per_serving`, CASE WHEN `n`.`recipe_id` is null THEN 0 ELSE 1 END AS `has_nutrition` FROM (`v_recipe_decision_scored` `d` left join `v_recipe_nutrition_per_serving` `n` on(`n`.`recipe_id` = `d`.`recipe_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `v_recipe_decision_with_nutrition`
--
DROP TABLE IF EXISTS `v_recipe_decision_with_nutrition`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_recipe_decision_with_nutrition`  AS SELECT `d`.`recipe_id` AS `recipe_id`, `d`.`recipe_name` AS `recipe_name`, `d`.`ingredients_total` AS `ingredients_total`, `d`.`pantry_matches` AS `pantry_matches`, `d`.`reuse_score` AS `reuse_score`, `d`.`waste_priority_score` AS `waste_priority_score`, `d`.`co2e_total_kg` AS `co2e_total_kg`, `d`.`land_total_m2` AS `land_total_m2`, `d`.`water_total_l` AS `water_total_l`, `d`.`has_sustainability` AS `has_sustainability`, `d`.`uses_pantry` AS `uses_pantry`, `d`.`co2e_band` AS `co2e_band`, `d`.`decision_score` AS `decision_score`, `n`.`recipe_mass_g` AS `recipe_mass_g`, `n`.`energy_kcal_per_100g_recipe` AS `energy_kcal_per_100g_recipe`, `n`.`protein_g_per_100g_recipe` AS `protein_g_per_100g_recipe`, `n`.`fat_g_per_100g_recipe` AS `fat_g_per_100g_recipe`, `n`.`carbs_g_per_100g_recipe` AS `carbs_g_per_100g_recipe`, `n`.`sugar_g_per_100g_recipe` AS `sugar_g_per_100g_recipe`, `n`.`fibre_g_per_100g_recipe` AS `fibre_g_per_100g_recipe`, `n`.`salt_g_per_100g_recipe` AS `salt_g_per_100g_recipe`, CASE WHEN `n`.`recipe_id` is null THEN 0 ELSE 1 END AS `has_nutrition_density` FROM (`v_recipe_decision_scored` `d` left join `v_recipe_mass_and_nutrition` `n` on(`n`.`recipe_id` = `d`.`recipe_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `v_recipe_mass_and_nutrition`
--
DROP TABLE IF EXISTS `v_recipe_mass_and_nutrition`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_recipe_mass_and_nutrition`  AS SELECT `ri`.`recipe_id` AS `recipe_id`, sum(`ri`.`quantity_g`) AS `recipe_mass_g`, sum(`ri`.`quantity_g` / 100 * `nf`.`energy_kcal`) AS `energy_kcal_total`, sum(`ri`.`quantity_g` / 100 * `nf`.`protein_g`) AS `protein_g_total`, sum(`ri`.`quantity_g` / 100 * `nf`.`fat_g`) AS `fat_g_total`, sum(`ri`.`quantity_g` / 100 * `nf`.`carbs_g`) AS `carbs_g_total`, sum(`ri`.`quantity_g` / 100 * `nf`.`sugar_g`) AS `sugar_g_total`, sum(`ri`.`quantity_g` / 100 * `nf`.`fibre_g`) AS `fibre_g_total`, sum(`ri`.`quantity_g` / 100 * `nf`.`salt_g`) AS `salt_g_total`, sum(`ri`.`quantity_g` / 100 * `nf`.`energy_kcal`) / nullif(sum(`ri`.`quantity_g`),0) * 100 AS `energy_kcal_per_100g_recipe`, sum(`ri`.`quantity_g` / 100 * `nf`.`protein_g`) / nullif(sum(`ri`.`quantity_g`),0) * 100 AS `protein_g_per_100g_recipe`, sum(`ri`.`quantity_g` / 100 * `nf`.`fat_g`) / nullif(sum(`ri`.`quantity_g`),0) * 100 AS `fat_g_per_100g_recipe`, sum(`ri`.`quantity_g` / 100 * `nf`.`carbs_g`) / nullif(sum(`ri`.`quantity_g`),0) * 100 AS `carbs_g_per_100g_recipe`, sum(`ri`.`quantity_g` / 100 * `nf`.`sugar_g`) / nullif(sum(`ri`.`quantity_g`),0) * 100 AS `sugar_g_per_100g_recipe`, sum(`ri`.`quantity_g` / 100 * `nf`.`fibre_g`) / nullif(sum(`ri`.`quantity_g`),0) * 100 AS `fibre_g_per_100g_recipe`, sum(`ri`.`quantity_g` / 100 * `nf`.`salt_g`) / nullif(sum(`ri`.`quantity_g`),0) * 100 AS `salt_g_per_100g_recipe` FROM (`recipe_ingredient` `ri` join `nutrition_fact` `nf` on(`nf`.`food_item_id` = `ri`.`food_item_id`)) WHERE `ri`.`quantity_g` is not null GROUP BY `ri`.`recipe_id` ;

-- --------------------------------------------------------

--
-- Structure for view `v_recipe_nutrition`
--
DROP TABLE IF EXISTS `v_recipe_nutrition`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_recipe_nutrition`  AS SELECT `ri`.`recipe_id` AS `recipe_id`, sum(`ri`.`quantity_g` / 100 * `nf`.`energy_kcal`) AS `energy_kcal_total`, sum(`ri`.`quantity_g` / 100 * `nf`.`protein_g`) AS `protein_g_total`, sum(`ri`.`quantity_g` / 100 * `nf`.`fat_g`) AS `fat_g_total`, sum(`ri`.`quantity_g` / 100 * `nf`.`carbs_g`) AS `carbs_g_total`, sum(`ri`.`quantity_g` / 100 * `nf`.`sugar_g`) AS `sugar_g_total`, sum(`ri`.`quantity_g` / 100 * `nf`.`fibre_g`) AS `fibre_g_total`, sum(`ri`.`quantity_g` / 100 * `nf`.`salt_g`) AS `salt_g_total` FROM (`recipe_ingredient` `ri` join `nutrition_fact` `nf` on(`nf`.`food_item_id` = `ri`.`food_item_id`)) WHERE `ri`.`quantity_g` is not null GROUP BY `ri`.`recipe_id` ;

-- --------------------------------------------------------

--
-- Structure for view `v_recipe_nutrition_per_serving`
--
DROP TABLE IF EXISTS `v_recipe_nutrition_per_serving`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_recipe_nutrition_per_serving`  AS SELECT `r`.`recipe_id` AS `recipe_id`, `r`.`recipe_name` AS `recipe_name`, `r`.`servings_raw` AS `servings_raw`, `r`.`servings_effective` AS `servings_effective`, `n`.`energy_kcal_total` AS `energy_kcal_total`, `n`.`protein_g_total` AS `protein_g_total`, `n`.`fat_g_total` AS `fat_g_total`, `n`.`carbs_g_total` AS `carbs_g_total`, `n`.`sugar_g_total` AS `sugar_g_total`, `n`.`fibre_g_total` AS `fibre_g_total`, `n`.`salt_g_total` AS `salt_g_total`, `n`.`energy_kcal_total`/ `r`.`servings_effective` AS `energy_kcal_per_serving`, `n`.`protein_g_total`/ `r`.`servings_effective` AS `protein_g_per_serving`, `n`.`fat_g_total`/ `r`.`servings_effective` AS `fat_g_per_serving`, `n`.`carbs_g_total`/ `r`.`servings_effective` AS `carbs_g_per_serving`, `n`.`sugar_g_total`/ `r`.`servings_effective` AS `sugar_g_per_serving`, `n`.`fibre_g_total`/ `r`.`servings_effective` AS `fibre_g_per_serving`, `n`.`salt_g_total`/ `r`.`servings_effective` AS `salt_g_per_serving` FROM (`v_recipe_servings_effective` `r` join `v_recipe_nutrition` `n` on(`n`.`recipe_id` = `r`.`recipe_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `v_recipe_nutrition_quality`
--
DROP TABLE IF EXISTS `v_recipe_nutrition_quality`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_recipe_nutrition_quality`  AS SELECT `v_recipe_mass_and_nutrition`.`recipe_id` AS `recipe_id`, `v_recipe_mass_and_nutrition`.`recipe_mass_g` AS `recipe_mass_g`, CASE WHEN `v_recipe_mass_and_nutrition`.`recipe_mass_g` >= 100 THEN 1 ELSE 0 END AS `nutrition_reliable` FROM `v_recipe_mass_and_nutrition` ;

-- --------------------------------------------------------

--
-- Structure for view `v_recipe_pantry_match`
--
DROP TABLE IF EXISTS `v_recipe_pantry_match`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_recipe_pantry_match`  AS SELECT `ri`.`recipe_id` AS `recipe_id`, `ri`.`food_item_id` AS `food_item_id`, count(0) AS `ingredient_instances`, max(`vr`.`waste_risk_score`) AS `waste_risk_score` FROM (`recipe_ingredient` `ri` join `v_pantry_waste_risk` `vr` on(`vr`.`food_item_id` = `ri`.`food_item_id`)) GROUP BY `ri`.`recipe_id`, `ri`.`food_item_id` ;

-- --------------------------------------------------------

--
-- Structure for view `v_recipe_pantry_reuse`
--
DROP TABLE IF EXISTS `v_recipe_pantry_reuse`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_recipe_pantry_reuse`  AS SELECT `r`.`recipe_id` AS `recipe_id`, `r`.`name` AS `recipe_name`, count(`ri`.`food_item_id`) AS `ingredients_total`, count(distinct `rpm`.`food_item_id`) AS `pantry_matches`, round(count(distinct `rpm`.`food_item_id`) / nullif(count(`ri`.`food_item_id`),0),3) AS `reuse_score`, coalesce(sum(`rpm`.`waste_risk_score`),0) AS `waste_priority_score` FROM ((`recipe` `r` join `recipe_ingredient` `ri` on(`ri`.`recipe_id` = `r`.`recipe_id`)) left join `v_recipe_pantry_match` `rpm` on(`rpm`.`recipe_id` = `r`.`recipe_id` and `rpm`.`food_item_id` = `ri`.`food_item_id`)) GROUP BY `r`.`recipe_id`, `r`.`name` ;

-- --------------------------------------------------------

--
-- Structure for view `v_recipe_servings_effective`
--
DROP TABLE IF EXISTS `v_recipe_servings_effective`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_recipe_servings_effective`  AS SELECT `recipe`.`recipe_id` AS `recipe_id`, `recipe`.`name` AS `recipe_name`, `recipe`.`servings` AS `servings_raw`, CASE WHEN `recipe`.`servings` is null OR `recipe`.`servings` < 1 THEN 4 ELSE `recipe`.`servings` END AS `servings_effective` FROM `recipe` ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
