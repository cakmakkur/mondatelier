package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.art.ArtworkLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArtworkLikeRepository extends JpaRepository<ArtworkLike, Long> {
    List<ArtworkLike> findByArtwork_Id(String artworkId);
    List<ArtworkLike> findByProfile_Id(String profileId);
    Optional<ArtworkLike> findByArtwork_IdAndProfile_Id(String artworkId, String profileId);
}
