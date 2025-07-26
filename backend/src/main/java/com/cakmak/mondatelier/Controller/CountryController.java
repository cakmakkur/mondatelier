package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.Country;
import com.cakmak.mondatelier.Repository.CountryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/countries")
public class CountryController {

    private final CountryRepository countryRepository;

    public CountryController(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    // transfer to service class
    @GetMapping
    public ResponseEntity<List<String>> getCountries () {
        List<String> countries = new ArrayList<>();
                countryRepository.findAll().forEach(country -> {
            countries.add(country.getCountry());
        });
        return ResponseEntity.ok(countries);
    }

}
