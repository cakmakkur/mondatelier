package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.art.ArtworkType;
import com.cakmak.mondatelier.util.ArtworkTypeKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtworkTypesRepository extends JpaRepository<ArtworkType, ArtworkTypeKey> {
    List<ArtworkType> findByArtwork_Id(String artworkId);
}
