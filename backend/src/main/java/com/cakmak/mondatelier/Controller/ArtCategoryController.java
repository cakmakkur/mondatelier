package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.art.ArtCategory;
import com.cakmak.mondatelier.Repository.ArtCategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/art_categories")
public class ArtCategoryController {

    private ArtCategoryRepository artCategoryRepository;

    public ArtCategoryController(ArtCategoryRepository artCategoryRepository) {
        this.artCategoryRepository = artCategoryRepository;
    }

    @GetMapping("/all")
    public ResponseEntity<List<String>> getAll() {
        List<ArtCategory> artCategories = artCategoryRepository.findAll();
        List<String> categoryNames = new ArrayList<>();
        for (ArtCategory artCategory : artCategories) {
            categoryNames.add(artCategory.getName());
        }
        return ResponseEntity.ok(categoryNames);
    }
}
