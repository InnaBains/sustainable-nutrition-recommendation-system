package uk.arden.p17121.sustainablenutrition.dto;

import java.util.List;
import java.math.BigDecimal;

public class RecommendationRow {

    private Integer recipeId;
    private String recipeName;
    private Long pantryMatches;
    private BigDecimal reuseScore;
    private BigDecimal wastePriorityScore;
    private BigDecimal co2eTotalKg;
    private BigDecimal decisionScore;
    private BigDecimal decisionScoreNutrition;
    private BigDecimal energyKcalPer100gRecipe;
    private BigDecimal proteinGPer100gRecipe;
    private List<String> ingredientNames;

    public RecommendationRow() {
    }

    public Integer getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Integer recipeId) {
        this.recipeId = recipeId;
    }

    public String getRecipeName() {
        return recipeName;
    }

    public void setRecipeName(String recipeName) {
        this.recipeName = recipeName;
    }

    public Long getPantryMatches() {
        return pantryMatches;
    }

    public void setPantryMatches(Long pantryMatches) {
        this.pantryMatches = pantryMatches;
    }

    public BigDecimal getReuseScore() {
        return reuseScore;
    }

    public void setReuseScore(BigDecimal reuseScore) {
        this.reuseScore = reuseScore;
    }

    public BigDecimal getWastePriorityScore() {
        return wastePriorityScore;
    }

    public void setWastePriorityScore(BigDecimal wastePriorityScore) {
        this.wastePriorityScore = wastePriorityScore;
    }

    public BigDecimal getCo2eTotalKg() {
        return co2eTotalKg;
    }

    public void setCo2eTotalKg(BigDecimal co2eTotalKg) {
        this.co2eTotalKg = co2eTotalKg;
    }

    public BigDecimal getDecisionScore() {
        return decisionScore;
    }

    public void setDecisionScore(BigDecimal decisionScore) {
        this.decisionScore = decisionScore;
    }

    public BigDecimal getDecisionScoreNutrition() {
        return decisionScoreNutrition;
    }

    public void setDecisionScoreNutrition(BigDecimal decisionScoreNutrition) {
        this.decisionScoreNutrition = decisionScoreNutrition;
    }

    public BigDecimal getEnergyKcalPer100gRecipe() {
        return energyKcalPer100gRecipe;
    }

    public void setEnergyKcalPer100gRecipe(BigDecimal energyKcalPer100gRecipe) {
        this.energyKcalPer100gRecipe = energyKcalPer100gRecipe;
    }

    public BigDecimal getProteinGPer100gRecipe() {
        return proteinGPer100gRecipe;
    }

    public void setProteinGPer100gRecipe(BigDecimal proteinGPer100gRecipe) {
        this.proteinGPer100gRecipe = proteinGPer100gRecipe;
    }

    public List<String> getIngredientNames() {
        return ingredientNames;
    }

    public void setIngredientNames(List<String> ingredientNames) {
        this.ingredientNames = ingredientNames;
    }


    
}

