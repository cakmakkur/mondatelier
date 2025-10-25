package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Repository.EventRepository;
import com.cakmak.mondatelier.dto.EventDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class EventServiceTest {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventRepository eventRepository;


    @Test
    void testGetEventById () {
        EventDTO eventDTO = eventService.getEventById("df1d5f60-ebc9-4e83-aa83-7d518ee46ab0");

        assertNotNull(eventDTO);
        assertEquals("NEW", eventDTO.title());
        assertEquals(2, eventDTO.type());
        assertEquals("Vienna", eventDTO.city());
        assertEquals("description", eventDTO.description());
        assertEquals("2025-08-23 20:22:38.421", eventDTO.createdAt().toString());
        assertEquals("2025-08-23 02:00:00.0", eventDTO.date().toString());
        assertEquals("2", eventDTO.profileId());
        assertEquals("/events/1755973358402_Franz_Marc_020.jpg", eventDTO.thumbnail_url());

    }
}
