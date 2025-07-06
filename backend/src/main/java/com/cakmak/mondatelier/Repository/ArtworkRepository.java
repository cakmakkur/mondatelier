package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.art.Artwork;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, String> {
    Page<Artwork> findByProfileId(String profileId, Pageable pageable);
}
