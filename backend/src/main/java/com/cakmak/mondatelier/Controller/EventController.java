package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Service.EventService;
import com.cakmak.mondatelier.dto.EventDTO;
import com.cakmak.mondatelier.util.AuthUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEvent(@PathVariable String id) {
        User user = AuthUtil.getCurrentUser();
        EventDTO eventDTO = eventService.getEventById(id);
        return ResponseEntity.ok(eventDTO);
    };

    @PostMapping
    public ResponseEntity<Void> createEvent(@RequestBody EventDTO eventDTO) {
        eventService.createEvent(eventDTO);
        return ResponseEntity.ok().build();
    }

}
