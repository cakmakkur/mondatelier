package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Exception.types.UserProfileMismatchException;
import com.cakmak.mondatelier.Model.*;
import com.cakmak.mondatelier.Repository.CityRepository;
import com.cakmak.mondatelier.Repository.CountryRepository;
import com.cakmak.mondatelier.Repository.LanguageRepository;
import com.cakmak.mondatelier.Repository.PreferencesRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.PreferencesDto;
import com.cakmak.mondatelier.enums.LanguageTypes;
import com.cakmak.mondatelier.util.AuthUtil;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
public class PreferencesController {

    private final PreferencesRepository preferencesRepository;
    private final CountryRepository countryRepository;
    private final LanguageRepository languageRepository;
    private final CityRepository cityRepository;

    public PreferencesController(
            PreferencesRepository preferencesRepository,
            CityRepository cityRepository,
            CountryRepository countryRepository,
            LanguageRepository languageRepository) {
        this.preferencesRepository = preferencesRepository;
        this.cityRepository = cityRepository;
        this.countryRepository = countryRepository;
        this.languageRepository = languageRepository;
    }

    @GetMapping("{profileId}")
    public ResponseEntity<PreferencesDto> getMyPreferences(@PathVariable String profileId) {
        Preferences preferences = preferencesRepository.findByProfile_Id(profileId).orElseThrow(() -> new RuntimeException("Profile not found"));
        return ResponseEntity.ok(DTOMappers.toPreferencesDTO(preferences));
    }

    @PostMapping("/{profileId}")
    @Transactional
    public ResponseEntity<Void> updatePreferences(@PathVariable String profileId,
                                                  @RequestBody PreferencesDto preferencesDto) {
        User currentUser = AuthUtil.getCurrentUser();

        if (!currentUser.getProfile().getId().equals(profileId)) {
            throw new UserProfileMismatchException();
        }

        Profile profile = currentUser.getProfile(); // or profileRepository.findById(profileId).orElseThrow(...)

        Preferences preferences = preferencesRepository.findByProfile_Id(profile.getId())
                .orElseGet(() -> {
                    Preferences newPrefs = new Preferences();
                    newPrefs.setProfile(profile);
                    return newPrefs;
                });

        City city = preferencesDto.preferredCity() == null || preferencesDto.preferredCity().isEmpty()
                ? null
                : cityRepository.findByName(preferencesDto.preferredCity())
                .orElseThrow(() -> new RuntimeException("City not found"));

        Country country = preferencesDto.preferredCountry() == null || preferencesDto.preferredCountry().isEmpty()
                ? null
                : countryRepository.findByName(preferencesDto.preferredCountry());

        Language language = preferencesDto.language() == null || preferencesDto.language().isEmpty()
                ? null
                : languageRepository.findByName(LanguageTypes.valueOf(preferencesDto.language()))
                .orElseThrow(() -> new RuntimeException("Language not found"));

        preferences.setPreferredCity(city);
        preferences.setPreferredCountry(country);
        preferences.setLanguage(language);
        preferences.setAnimations(preferencesDto.animations());
        preferences.setNotifications(preferencesDto.notifications());

        preferencesRepository.save(preferences);

        return ResponseEntity.ok().build();
    }

}
