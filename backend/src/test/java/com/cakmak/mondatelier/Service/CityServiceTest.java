package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Model.City;
import com.cakmak.mondatelier.Model.Country;
import com.cakmak.mondatelier.Repository.CityRepository;
import com.cakmak.mondatelier.Repository.CountryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CityServiceTest {

    private CityService cityService;
    private CountryRepository countryRepository;

    @BeforeEach
    void setUp() {
        countryRepository = mock(CountryRepository.class);
        cityService = new CityService(countryRepository);
    }

    @Test
    void testGetCitiesByCountryId() {
        Country austria = new Country();
        austria.setName("Austria");
        City vienna = new City();
        vienna.setName("Vienna");
        City istanbul = new City();
        istanbul.setName("Istanbul");
        austria.setCities(List.of(vienna));

        when(countryRepository.findByName("Austria")).thenReturn(austria);

        List<City> result = cityService.getCitiesByCountryId("Austria");

        assertTrue(result.contains(vienna));
        assertFalse(result.contains(istanbul));
    }
}
