package uk.arden.p17121.sustainablenutrition.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "pantry_item")
public class PantryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pantry_item_id")
    private Integer id;

    @Column(name = "food_item_id", nullable = false)
    private Integer foodItemId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal quantity;

    @Column(nullable = false)
    private String unit;

    @Column(name = "expires_on")
    private LocalDate expiresOn;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getFoodItemId() { return foodItemId; }
    public void setFoodItemId(Integer foodItemId) { this.foodItemId = foodItemId; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDate getExpiresOn() { return expiresOn; }
    public void setExpiresOn(LocalDate expiresOn) { this.expiresOn = expiresOn; }
}