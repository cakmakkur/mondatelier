package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.art.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, String> {
}
