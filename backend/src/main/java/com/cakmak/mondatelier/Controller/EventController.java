package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Repository.EventRepository;
import com.cakmak.mondatelier.Service.EventService;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.EventDTO;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final EventRepository eventRepository;

    public EventController(EventService eventService, EventRepository eventRepository) {
        this.eventService = eventService;
        this.eventRepository = eventRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEvent(@PathVariable String id) {
        EventDTO eventDTO = eventService.getEventById(id);
        return ResponseEntity.ok(eventDTO);
    };

    //doesnt work correctly
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
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    // returns currently random events
    @GetMapping("/highlights")
    public ResponseEntity<List<EventDTO>> getHighlights() {
        List<EventDTO> dtoList = eventRepository.findAll()
                .stream()
                .map(DTOMappers::toEventDTO)
                .toList();

        return ResponseEntity.ok()
                .header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
                .header("Pragma", "no-cache")
                .body(dtoList);
    }
}

