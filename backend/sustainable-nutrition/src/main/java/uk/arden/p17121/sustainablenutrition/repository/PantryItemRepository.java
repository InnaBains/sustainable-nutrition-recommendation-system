package uk.arden.p17121.sustainablenutrition.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.arden.p17121.sustainablenutrition.model.PantryItem;

public interface PantryItemRepository extends JpaRepository<PantryItem, Integer> {
}