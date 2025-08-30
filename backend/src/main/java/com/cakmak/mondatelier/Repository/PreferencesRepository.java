package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.Preferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PreferencesRepository extends JpaRepository<Preferences, Integer> {
    Optional<Preferences> findByProfile_Id(String profileId);
}
