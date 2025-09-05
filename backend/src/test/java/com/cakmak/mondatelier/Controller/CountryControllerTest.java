package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.Country;
import com.cakmak.mondatelier.Repository.CountryRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CountryControllerTest {

    @Test
    void testGetCountries() {
        CountryRepository mockRepo = mock(CountryRepository.class);

        Country country1 = new com.cakmak.mondatelier.Model.Country();
        Country country2 = new com.cakmak.mondatelier.Model.Country();

        country1.setName("Germany");
        country2.setName("Austria");

        when(mockRepo.findAll()).thenReturn(Arrays.asList(
                country1, country2
        ));

        CountryController controller = new CountryController(mockRepo);

        ResponseEntity<List<String>> response = controller.getCountries();

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertTrue(response.getBody().contains("Germany"));
        assertTrue(response.getBody().contains("Austria"));

        verify(mockRepo, times(1)).findAll();
    }
}
