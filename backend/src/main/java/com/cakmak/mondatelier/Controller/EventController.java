package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Service.EventService;
import com.cakmak.mondatelier.dto.ArtworkDTO;
import com.cakmak.mondatelier.dto.EventDTO;
import com.cakmak.mondatelier.util.AuthUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEvent(@PathVariable String id) {
        EventDTO eventDTO = eventService.getEventById(id);
        return ResponseEntity.ok(eventDTO);
    };

    @GetMapping
    public ResponseEntity<List<EventDTO>> getEvents(
        @RequestParam String city,
        @RequestParam(required = false) Integer calenderWeek,
        @RequestParam(required = false) Integer month,
        @RequestParam(required = false) Integer year)
    {
        List<EventDTO> events = eventService.getEventsByFilter(calenderWeek, month, year, city);
        return ResponseEntity.ok(events);
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createEvent(
            @RequestPart("event") EventDTO eventDTO,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        eventService.createEvent(eventDTO, imageFile);
        return ResponseEntity.ok().build();
    }
}

