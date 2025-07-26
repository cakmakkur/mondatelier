package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.City;
import com.cakmak.mondatelier.Service.CityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping("/by_country/{country}")
    public ResponseEntity<List<String>> getCitiesByCountry(@PathVariable String country) {
        List<City> cities = cityService.getCitiesByCountryId(country);
        List<String> cityNames = new ArrayList<>();
        for (City city : cities) {
            cityNames.add(city.getCity());
        }
        return ResponseEntity.ok(cityNames);
    }
}
