package uk.arden.p17121.sustainablenutrition.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import uk.arden.p17121.sustainablenutrition.dto.RecipeDetailsRow;
import uk.arden.p17121.sustainablenutrition.repository.RecipeDetailsRepository;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "*")
public class RecipeController {

    private final RecipeDetailsRepository repo;

    public RecipeController(RecipeDetailsRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{id}")
    public RecipeDetailsRow getRecipeById(@PathVariable int id) {
        RecipeDetailsRow recipe = repo.findById(id);

        if (recipe == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Recipe not found"
            );
        }

        return recipe;
    }
}
