package com.cakmak.mondatelier.Model.art;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "art_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArtCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "artCategory", fetch = FetchType.LAZY)
    private List<Artwork> artworks;

    @ManyToOne
    @JoinColumn(name = "media_type_id")
    private ArtMediaType mediaType;

    @OneToMany(mappedBy = "artCategory", fetch = FetchType.LAZY)
    private List<ArtType> artTypes;

}