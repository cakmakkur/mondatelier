package com.cakmak.mondatelier.util;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Embeddable
@Getter
@Setter
public class ArtworkTypeKey {
    @Column(name = "artwork_id")
    private String artworkId;

    @Column(name = "art_type_id")
    private Integer artTypeId;

    // Constructors
    public ArtworkTypeKey() {}

    public ArtworkTypeKey(String artworkId, Integer artTypeId) {
        this.artworkId = artworkId;
        this.artTypeId = artTypeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ArtworkTypeKey that)) return false;
        return Objects.equals(artworkId, that.artworkId) &&
                Objects.equals(artTypeId, that.artTypeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(artworkId, artTypeId);
    }
}
