package com.cakmak.mondatelier.Model;

import com.cakmak.mondatelier.Model.community.Community;
import com.cakmak.mondatelier.Model.community.Post;
import com.cakmak.mondatelier.Model.community.Vote;
import com.cakmak.mondatelier.Model.event.Event;
import com.cakmak.mondatelier.converter.ProfileTypesConverter;
import com.cakmak.mondatelier.enums.ProfileTypes;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Convert(converter = ProfileTypesConverter.class)
    @Column(name = "profile_type_id")
    private ProfileTypes type;

    private String firstname;

    private String lastname;

    private Date dob;

    private String bio;

    private String personalWebsite;

    @Column(name = "show_real_name")
    private Boolean showRealName;

    @Column(name = "profile_name")
    private String profileName;

    private Boolean active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id")
    private Country country;

    private String bannerPath;

    private String profilePicturePath;

    @OneToMany(mappedBy = "profile", fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.REMOVE)
    private List<Event> events;

    @OneToMany(mappedBy = "profile", fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.REMOVE)
    private List<Freelance> freelances;

    @OneToMany(mappedBy = "profile", fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.REMOVE)
    private List<Masterclass> masterclasses;

    @OneToOne(mappedBy = "profile", cascade = CascadeType.REMOVE)
    private Preferences preferences;

    @OneToMany(mappedBy = "profile", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Community> communities;

    @OneToMany(mappedBy = "profile", fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.REMOVE)
    private List<Vote> votes;

    @OneToMany(mappedBy = "profile", fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.REMOVE)
    private List<Post> posts;

}