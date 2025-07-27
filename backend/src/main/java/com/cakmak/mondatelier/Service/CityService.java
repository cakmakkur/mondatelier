package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Model.City;
import com.cakmak.mondatelier.Model.Country;
import com.cakmak.mondatelier.Repository.CityRepository;
import com.cakmak.mondatelier.Repository.CountryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityService {

    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;

    public CityService(CityRepository cityRepository, CountryRepository countryRepository) {
        this.cityRepository = cityRepository;
        this.countryRepository = countryRepository;
    }

    public List<City> getCitiesByCountryId (String c) {
        Country country = countryRepository.findByName(c);
        return country.getCities();
    }
}
