package uk.arden.p17121.sustainablenutrition.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import uk.arden.p17121.sustainablenutrition.dto.RecommendationRow;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class RecommendationRepository {

    private final JdbcTemplate jdbc;

    public RecommendationRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<RecommendationRow> getTopRecommendations(int limit) {
    String sql = """
        SELECT
            recipe_id,
            recipe_name,
            pantry_matches,
            reuse_score,
            waste_priority_score,
            co2e_total_kg,
            decision_score,
            decision_score_nutrition,
            energy_kcal_per_100g_recipe,
            protein_g_per_100g_recipe
        FROM v_recipe_decision_final
        ORDER BY decision_score_nutrition DESC
        LIMIT ?
        """;

    List<RecommendationRow> rows = jdbc.query(sql, new RecommendationRowMapper(), limit);

    for (RecommendationRow row : rows) {
        row.setIngredientNames(findIngredientNamesByRecipeId(row.getRecipeId()));
    }

    return rows;
}

public List<String> findIngredientNamesByRecipeId(int recipeId) {
    String sql = """
        SELECT DISTINCT fi.name
        FROM recipe_ingredient ri
        JOIN food_item fi ON fi.food_item_id = ri.food_item_id
        WHERE ri.recipe_id = ?
        ORDER BY fi.name
        """;

    return jdbc.query(
        sql,
        (rs, rowNum) -> rs.getString("name"),
        recipeId
    );
}

    static class RecommendationRowMapper implements RowMapper<RecommendationRow> {
        @Override
        public RecommendationRow mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            RecommendationRow row = new RecommendationRow();

            row.setRecipeId((Integer) rs.getObject("recipe_id"));
            row.setRecipeName(rs.getString("recipe_name"));

            Object pantryMatchesObj = rs.getObject("pantry_matches");
            if (pantryMatchesObj != null) {
                row.setPantryMatches(((Number) pantryMatchesObj).longValue());
            }

            row.setReuseScore(rs.getBigDecimal("reuse_score"));
            row.setWastePriorityScore(rs.getBigDecimal("waste_priority_score"));
            row.setCo2eTotalKg(rs.getBigDecimal("co2e_total_kg"));
            row.setDecisionScore(rs.getBigDecimal("decision_score"));
            row.setDecisionScoreNutrition(rs.getBigDecimal("decision_score_nutrition"));
            row.setEnergyKcalPer100gRecipe(rs.getBigDecimal("energy_kcal_per_100g_recipe"));
            row.setProteinGPer100gRecipe(rs.getBigDecimal("protein_g_per_100g_recipe"));

            return row;
        }
    }
}
