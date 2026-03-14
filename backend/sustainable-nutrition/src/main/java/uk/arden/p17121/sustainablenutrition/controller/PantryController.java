package uk.arden.p17121.sustainablenutrition.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import uk.arden.p17121.sustainablenutrition.dto.PantryWasteRiskRow;
import uk.arden.p17121.sustainablenutrition.model.PantryItem;
import uk.arden.p17121.sustainablenutrition.repository.PantryItemRepository;
import uk.arden.p17121.sustainablenutrition.repository.PantryWasteRiskRepository;

import java.util.List;

@RestController
@RequestMapping("/api/pantry")
@CrossOrigin(origins = "*")
public class PantryController {

    private final PantryItemRepository pantryRepo;
    private final PantryWasteRiskRepository pantryViewRepo;

    public PantryController(PantryItemRepository pantryRepo,
                            PantryWasteRiskRepository pantryViewRepo) {
        this.pantryRepo = pantryRepo;
        this.pantryViewRepo = pantryViewRepo;
    }

    /**
     * View endpoint: includes food name + perishability + waste risk score.
     * Reads from v_pantry_waste_risk (read-only).
     */
    @GetMapping
    public List<PantryWasteRiskRow> listWithRisk() {
        return pantryViewRepo.listPantryWithRisk();
    }

    /**
     * Create a pantry item (writes to pantry_item).
     * IMPORTANT: client should provide foodItemId, quantity, unit, expiresOn.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PantryItem add(@RequestBody PantryItem item) {
        // Ensure new insert rather than update
        item.setId(null);

        // Minimal validation (optional but recommended)
        if (item.getFoodItemId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "foodItemId is required");
        }
        if (item.getQuantity() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "quantity is required");
        }
        if (item.getUnit() == null || item.getUnit().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "unit is required");
        }

        return pantryRepo.save(item);
    }

    /**
     * Update an existing pantry item by id (writes to pantry_item).
     */
    @PutMapping("/{id}")
    public PantryItem update(@PathVariable int id, @RequestBody PantryItem item) {
        PantryItem existing = pantryRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Pantry item not found: " + id));

        // Update allowed fields
        if (item.getFoodItemId() != null) {
            existing.setFoodItemId(item.getFoodItemId());
        }
        if (item.getQuantity() != null) {
            existing.setQuantity(item.getQuantity());
        }
        if (item.getUnit() != null && !item.getUnit().trim().isEmpty()) {
            existing.setUnit(item.getUnit());
        }
        // expiresOn can legitimately be null (unknown), so allow null
        existing.setExpiresOn(item.getExpiresOn());

        return pantryRepo.save(existing);
    }

    /**
     * Delete a pantry item by id.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable int id) {
        if (!pantryRepo.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Pantry item not found: " + id);
        }
        pantryRepo.deleteById(id);
    }
}