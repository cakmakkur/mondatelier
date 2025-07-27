package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.art.ArtCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtCategoryRepository extends JpaRepository<ArtCategory, Long> {
}
