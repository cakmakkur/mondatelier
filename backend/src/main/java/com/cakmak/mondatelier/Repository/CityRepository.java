package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    Optional<City> findByCity(String city);
    List<City> findAllByCountryId(Long countryId);}
