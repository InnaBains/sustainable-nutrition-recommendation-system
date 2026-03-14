package uk.arden.p17121.sustainablenutrition.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PantryWasteRiskRow {

    private Integer pantryItemId;
    private Integer foodItemId;
    private String foodName;
    private String perishabilityCode;
    private BigDecimal quantity;
    private String unit;
    private LocalDate expiresOn;
    private Integer wasteRiskScore;

    public PantryWasteRiskRow() {}

    public Integer getPantryItemId() { return pantryItemId; }
    public void setPantryItemId(Integer pantryItemId) { this.pantryItemId = pantryItemId; }

    public Integer getFoodItemId() { return foodItemId; }
    public void setFoodItemId(Integer foodItemId) { this.foodItemId = foodItemId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public String getPerishabilityCode() { return perishabilityCode; }
    public void setPerishabilityCode(String perishabilityCode) { this.perishabilityCode = perishabilityCode; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDate getExpiresOn() { return expiresOn; }
    public void setExpiresOn(LocalDate expiresOn) { this.expiresOn = expiresOn; }

    public Integer getWasteRiskScore() { return wasteRiskScore; }
    public void setWasteRiskScore(Integer wasteRiskScore) { this.wasteRiskScore = wasteRiskScore; }
}