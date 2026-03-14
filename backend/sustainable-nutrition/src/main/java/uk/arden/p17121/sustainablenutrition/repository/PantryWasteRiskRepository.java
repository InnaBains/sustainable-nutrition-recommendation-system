package uk.arden.p17121.sustainablenutrition.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import uk.arden.p17121.sustainablenutrition.dto.PantryWasteRiskRow;
import org.springframework.lang.NonNull;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class PantryWasteRiskRepository {

    private final JdbcTemplate jdbc;

    public PantryWasteRiskRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<PantryWasteRiskRow> listPantryWithRisk() {
        String sql = """
            SELECT
              pi.pantry_item_id,
              pi.food_item_id,
              fi.name AS food_name,
              fi.perishability_code,
              pi.quantity,
              pi.unit,
              pi.expires_on,
              v.waste_risk_score
            FROM pantry_item pi
            JOIN food_item fi ON fi.food_item_id = pi.food_item_id
            JOIN v_pantry_waste_risk v ON v.pantry_item_id = pi.pantry_item_id
            ORDER BY v.waste_risk_score DESC, pi.expires_on ASC
            """;

        return jdbc.query(sql, new PantryWasteRiskRowMapper());
    }

    static class PantryWasteRiskRowMapper implements RowMapper<PantryWasteRiskRow> {
        @Override
        public PantryWasteRiskRow mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            PantryWasteRiskRow row = new PantryWasteRiskRow();

            row.setPantryItemId(rs.getInt("pantry_item_id"));

            // IMPORTANT: keep null if DB is null
            row.setFoodItemId((Integer) rs.getObject("food_item_id"));

            row.setFoodName(rs.getString("food_name"));
            row.setPerishabilityCode(rs.getString("perishability_code"));
            row.setQuantity(rs.getBigDecimal("quantity"));
            row.setUnit(rs.getString("unit"));
            row.setExpiresOn(rs.getDate("expires_on") != null ? rs.getDate("expires_on").toLocalDate() : null);
            row.setWasteRiskScore(rs.getInt("waste_risk_score"));

            return row;
        }
    }
}