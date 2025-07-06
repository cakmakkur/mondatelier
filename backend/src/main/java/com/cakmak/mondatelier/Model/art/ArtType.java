package com.cakmak.mondatelier.Model.art;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "art_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArtType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private ArtCategory artCategory;

    @ManyToMany(mappedBy = "artTypes")
    private Set<Artwork> artworks;

}
