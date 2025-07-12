package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.ProfileNotFoundException;
import com.cakmak.mondatelier.Model.City;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Model.event.Event;
import com.cakmak.mondatelier.Model.event.EventType;
import com.cakmak.mondatelier.Repository.CityRepository;
import com.cakmak.mondatelier.Repository.EventRepository;
import com.cakmak.mondatelier.Repository.EventTypeRepository;
import com.cakmak.mondatelier.Repository.ProfileRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.EventDTO;
import com.cakmak.mondatelier.util.SanitizeInput;
import org.springframework.stereotype.Service;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final EventTypeRepository eventTypeRepository;
    private final CityRepository cityRepository;
    private final ProfileRepository profileRepository;

    public EventService(EventRepository eventRepository,
                        EventTypeRepository eventTypeRepository,
                        CityRepository cityRepository,
                        ProfileRepository profileRepository) {
        this.eventRepository = eventRepository;
        this.eventTypeRepository = eventTypeRepository;
        this.cityRepository = cityRepository;
        this.profileRepository = profileRepository;
    }

    public EventDTO getEventById(String id) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        return DTOMappers.toEventDTO(event);
    }

    public void createEvent(EventDTO eventDTO) {
        Event event = new Event();
        event.setTitle(SanitizeInput.sanitize(eventDTO.title()));
        event.setDescription(SanitizeInput.sanitize(eventDTO.description()));
        EventType eventType = eventTypeRepository.findById(Long.valueOf(eventDTO.type())).orElseThrow(() -> {throw new RuntimeException("Type not found");});
        event.setType(eventType);
        City city = cityRepository.findByCity(eventDTO.city()).orElseThrow(() -> {throw new RuntimeException("City not found");});
        event.setCity(city);
        event.setDate(eventDTO.date());
        Profile profile = profileRepository.findById(eventDTO.profileId()).orElseThrow(ProfileNotFoundException::new);
        event.setProfile(profile);
        eventRepository.save(event);
    }
}
