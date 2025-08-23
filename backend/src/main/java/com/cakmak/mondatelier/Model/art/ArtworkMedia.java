package com.cakmak.mondatelier.Model.art;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "artwork_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArtworkMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String path;

    @Column(name = "is_thumbnail")
    private boolean isThumbnail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artwork_id", nullable = false)
    private Artwork artwork;

}
