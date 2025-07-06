package com.cakmak.mondatelier.Model.art;

import com.cakmak.mondatelier.Model.Profile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "artworks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Artwork {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @ManyToOne
    @JoinColumn(name = "art_category_id")
    private ArtCategory artCategory;

    private Boolean salable;

    private Integer price;

    @JoinColumn(name = "release_year")
    private Integer releaseYear;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    private String dimensions;

    private Integer duration;

    @ManyToMany
    @JoinTable(
            name = "artwork_types",
            joinColumns = @JoinColumn(name = "artwork_id"),
            inverseJoinColumns = @JoinColumn(name = "art_type_id")
    )
    private Set<ArtType> artTypes;

    @OneToMany(mappedBy = "artwork", fetch = FetchType.LAZY)
    private List<ArtworkMedia> mediaList;
}
