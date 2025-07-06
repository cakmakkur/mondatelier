package com.cakmak.mondatelier.Model.art;

import com.cakmak.mondatelier.Model.Continent;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "art_media_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArtMediaType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "mediaType", fetch = FetchType.LAZY)
    private Set<ArtCategory> artCategories;

}
