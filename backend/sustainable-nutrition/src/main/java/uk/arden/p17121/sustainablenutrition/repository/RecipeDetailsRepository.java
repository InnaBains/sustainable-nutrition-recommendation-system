package uk.arden.p17121.sustainablenutrition.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import uk.arden.p17121.sustainablenutrition.dto.RecipeDetailsRow;
import uk.arden.p17121.sustainablenutrition.dto.RecipeIngredientRow;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class RecipeDetailsRepository {

    private final JdbcTemplate jdbc;

    public RecipeDetailsRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public RecipeDetailsRow findById(int recipeId) {
        String recipeSql = """
            SELECT
                recipe_id,
                name,
                description,
                instructions,
                servings
            FROM recipe
            WHERE recipe_id = ?
            """;

        List<RecipeDetailsRow> recipes = jdbc.query(recipeSql, new RecipeDetailsRowMapper(), recipeId);

        if (recipes.isEmpty()) {
            return null;
        }

        RecipeDetailsRow recipe = recipes.get(0);

        String ingredientSql = """
            SELECT
                sk.ingredient_text AS original_text,
                sp.quantity,
                sp.unit,
                COALESCE(fi.name, sp.ingredient_core, sk.ingredient_text) AS food_name
            FROM recipe_id_map rim
            JOIN stg_recipe_ingredient_kaggle sk
                ON sk.ext_recipe_id = rim.ext_recipe_id
            LEFT JOIN stg_recipe_ingredient_parsed sp
                ON sp.ext_recipe_id = sk.ext_recipe_id
               AND sp.ingredient_pos = sk.ingredient_pos
            LEFT JOIN ingredient_to_food_item ifi
                ON ifi.ingredient_core2 = sp.ingredient_core
            LEFT JOIN food_item fi
                ON fi.food_item_id = ifi.food_item_id
            WHERE rim.recipe_id = ?
            ORDER BY sk.ingredient_pos
            """;

        List<RecipeIngredientRow> ingredients =
                jdbc.query(ingredientSql, new RecipeIngredientRowMapper(), recipeId);

        recipe.setIngredients(ingredients);

        return recipe;
    }

    static class RecipeDetailsRowMapper implements RowMapper<RecipeDetailsRow> {
        @Override
        public RecipeDetailsRow mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            RecipeDetailsRow row = new RecipeDetailsRow();
            row.setRecipeId((Integer) rs.getObject("recipe_id"));
            row.setRecipeName(rs.getString("name"));
            row.setDescription(rs.getString("description"));
            row.setInstructions(rs.getString("instructions"));
            row.setServings((Integer) rs.getObject("servings"));
            return row;
        }
    }

    static class RecipeIngredientRowMapper implements RowMapper<RecipeIngredientRow> {
        @Override
        public RecipeIngredientRow mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            RecipeIngredientRow row = new RecipeIngredientRow();
            row.setOriginalText(rs.getString("original_text"));
            row.setFoodName(rs.getString("food_name"));
            row.setQuantity(rs.getBigDecimal("quantity"));
            row.setUnit(rs.getString("unit"));
            return row;
        }
    }
}