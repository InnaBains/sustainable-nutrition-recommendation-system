package uk.arden.p17121.sustainablenutrition.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import uk.arden.p17121.sustainablenutrition.dto.RecommendationRow;
import uk.arden.p17121.sustainablenutrition.repository.RecommendationRepository;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationRepository repo;

    public RecommendationController(RecommendationRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<RecommendationRow> getRecommendations(
            @RequestParam(defaultValue = "20") int limit) {

        if (limit < 1 || limit > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "limit must be between 1 and 100"
            );
        }

        return repo.getTopRecommendations(limit);
    }
}
