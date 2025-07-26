package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Service.EventService;
import com.cakmak.mondatelier.dto.EventDTO;
import com.cakmak.mondatelier.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Void> createEvent(
            @RequestPart("event") @Valid EventDTO eventDTO,
            @RequestPart("image") MultipartFile imageFile
    ) {
        User user = AuthUtil.getCurrentUser();
        eventService.createEvent(eventDTO, imageFile);
        return ResponseEntity.ok().build();
    }
}
