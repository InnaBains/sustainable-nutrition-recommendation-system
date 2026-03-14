package uk.arden.p17121.sustainablenutrition.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.arden.p17121.sustainablenutrition.model.FoodItem;

public interface FoodItemRepository extends JpaRepository<FoodItem, Integer> {
}

