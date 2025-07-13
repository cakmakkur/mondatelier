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
@Table(name = "masterclasses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Masterclass {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "profile_id")
    private Profile profile;

    private String title;

    private String description;

    private Integer sessions;

    @Column(name = "session_duration")
    private Integer sessionDuration;

    @Column(name = "session_price")
    private Integer sessionPrice;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "art_category_id")
    private ArtCategory artCategory;

}
