package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.art.ArtworkMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArtworkMediaRepository extends JpaRepository<ArtworkMedia, String> {
    Optional<ArtworkMedia> findByArtworkId(String id);
}
