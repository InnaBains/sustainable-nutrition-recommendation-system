package uk.arden.p17121.sustainablenutrition.dto;

import java.util.ArrayList;
import java.util.List;

public class RecipeDetailsRow {

    private Integer recipeId;
    private String recipeName;
    private String description;
    private String instructions;
    private Integer servings;
    private List<RecipeIngredientRow> ingredients = new ArrayList<>();

    public RecipeDetailsRow() {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public Integer getServings() {
        return servings;
    }

    public void setServings(Integer servings) {
        this.servings = servings;
    }

    public List<RecipeIngredientRow> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<RecipeIngredientRow> ingredients) {
        this.ingredients = ingredients;
    }
}