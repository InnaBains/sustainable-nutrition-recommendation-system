package uk.arden.p17121.sustainablenutrition.model;

import jakarta.persistence.*;

@Entity
@Table(name = "food_item")
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_item_id")
    private Integer id;

    @Column(nullable = false)
    private String name;

    private String category;

    @Column(name = "cofid_code")
    private String cofidCode;

    @Column(name = "base_unit")
    private String baseUnit;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCofidCode() { return cofidCode; }
    public void setCofidCode(String cofidCode) { this.cofidCode = cofidCode; }

    public String getBaseUnit() { return baseUnit; }
    public void setBaseUnit(String baseUnit) { this.baseUnit = baseUnit; }
}

