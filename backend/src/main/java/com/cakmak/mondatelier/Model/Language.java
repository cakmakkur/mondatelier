package com.cakmak.mondatelier.Model;

import com.cakmak.mondatelier.enums.LanguageTypes;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Table(name = "languages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    private LanguageTypes name;

    @OneToMany(mappedBy = "language", fetch = LAZY, orphanRemoval = true)
    private List<Preferences> preferences;
}
