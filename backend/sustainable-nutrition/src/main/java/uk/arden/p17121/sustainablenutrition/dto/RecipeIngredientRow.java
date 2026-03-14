package uk.arden.p17121.sustainablenutrition.dto;

import java.math.BigDecimal;

public class RecipeIngredientRow {

    private String originalText;
    private String foodName;
    private BigDecimal quantity;
    private String unit;

    public RecipeIngredientRow() {
    }

    public String getOriginalText() {
        return originalText;
    }

    public void setOriginalText(String originalText) {
        this.originalText = originalText;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}