package uk.arden.p17121.sustainablenutrition.controller;

import org.springframework.web.bind.annotation.*;
import uk.arden.p17121.sustainablenutrition.model.FoodItem;
import uk.arden.p17121.sustainablenutrition.repository.FoodItemRepository;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodItemController {

    private final FoodItemRepository repo;

    public FoodItemController(FoodItemRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<FoodItem> getAllFoods() {
        return repo.findAll();
    }
}

