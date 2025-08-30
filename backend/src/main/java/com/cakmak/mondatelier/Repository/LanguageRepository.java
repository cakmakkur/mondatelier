package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.Language;
import com.cakmak.mondatelier.enums.LanguageTypes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LanguageRepository extends JpaRepository<Language, Long> {
    Optional<Language> findByName(LanguageTypes name);
}
