package com.cakmak.mondatelier.Model.art;

import com.cakmak.mondatelier.util.ArtworkTypeKey;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "artwork_types")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ArtworkType {

    @EmbeddedId
    private ArtworkTypeKey id;

    @ManyToOne
    @MapsId("artworkId")
    @JoinColumn(name = "artwork_id")
    private Artwork artwork;

    @ManyToOne
    @MapsId("artTypeId")
    @JoinColumn(name = "art_type_id")
    private ArtType artType;

}