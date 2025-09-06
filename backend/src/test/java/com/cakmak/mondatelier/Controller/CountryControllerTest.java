package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Repository.CountryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
class CountryControllerIntegrationTest {

    @Autowired
    private CountryRepository countryRepository;
    @Autowired
    private CountryController countryController;


    @Test
    void testGetCountries() {

        ResponseEntity<List<String>> response = countryController.getCountries();

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());

        assertTrue(response.getBody().contains("Germany"));
        assertTrue(response.getBody().contains("Turkey"));

    }

}
