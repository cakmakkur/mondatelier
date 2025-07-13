package com.cakmak.mondatelier.Model;

import com.cakmak.mondatelier.Model.art.ArtCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "freelances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Freelance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "art_category_id")
    private ArtCategory artCategory;

    private String description;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;
}
