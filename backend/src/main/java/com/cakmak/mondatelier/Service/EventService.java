package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.types.EventNotFoundException;
import com.cakmak.mondatelier.Exception.types.ProfileNotFoundException;
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
import com.cakmak.mondatelier.util.UploadImage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.IsoFields;
import java.time.temporal.TemporalAdjusters;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final EventTypeRepository eventTypeRepository;
    private final CityRepository cityRepository;
    private final ProfileRepository profileRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

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
        Event event = eventRepository.findById(id).orElseThrow(EventNotFoundException::new);
        return DTOMappers.toEventDTO(event);
    }

    public List<EventDTO> getEventsByProfile(String id) {
        Profile profile = profileRepository.findById(id).orElseThrow(ProfileNotFoundException::new);
        List<Event> events = eventRepository.findByProfile(profile);
        List<EventDTO> eventDTOS = new ArrayList<>();
        for (Event event : events) {
            eventDTOS.add(DTOMappers.toEventDTO(event));
        }
        return eventDTOS;
    }

    public List<EventDTO> getHighlights() {
        return eventRepository.findTop5ByDateGreaterThanEqualOrderByDateAsc(new Date())
                .stream()
                .map(DTOMappers::toEventDTO)
                .toList();
    }

    public List<EventDTO> getEventsByFilter(Integer calendarWeek, Integer month, Integer year, String cityName) {
        if (cityName == null || cityName.isBlank()) return new ArrayList<>();

        City city = cityRepository.findByName(cityName)
                .orElseThrow(() -> new IllegalArgumentException("City not found"));

        int targetYear = year == null ? LocalDate.now(ZoneOffset.UTC).getYear() : year;
        LocalDate startDate;
        LocalDate endDate;

        if (calendarWeek != null) {
            if (calendarWeek < 1 || calendarWeek > 53) {
                throw new IllegalArgumentException("Calendar week must be between 1 and 53");
            }
            startDate = LocalDate.of(targetYear, 1, 4)
                    .with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, calendarWeek)
                    .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            endDate = startDate.plusWeeks(1);
        } else if (month != null) {
            if (month < 1 || month > 12) {
                throw new IllegalArgumentException("Month must be between 1 and 12");
            }
            startDate = LocalDate.of(targetYear, month, 1);
            endDate = startDate.plusMonths(1);
        } else {
            throw new IllegalArgumentException("A calendar week or month is required");
        }

        Date start = Date.from(startDate.atStartOfDay().toInstant(ZoneOffset.UTC));
        Date end = Date.from(endDate.atStartOfDay().toInstant(ZoneOffset.UTC));

        return eventRepository
                .findByCityAndDateGreaterThanEqualAndDateLessThanOrderByDate(city, start, end)
                .stream()
                .map(DTOMappers::toEventDTO)
                .collect(Collectors.toList());
    }

    public void createEvent(EventDTO eventDTO, MultipartFile imageFile, Profile owner) {
        Event event = new Event();
        event.setTitle(SanitizeInput.sanitize(eventDTO.title()));
        event.setDescription(SanitizeInput.sanitize(eventDTO.description()));

        EventType eventType = eventTypeRepository.findById(Long.valueOf(eventDTO.type()))
                .orElseThrow(() -> new RuntimeException("Type not found"));
        event.setType(eventType);

        City city = cityRepository.findByName(eventDTO.city())
                .orElseThrow(() -> new RuntimeException("City not found"));
        event.setCity(city);

        event.setDate(eventDTO.date());

        event.setProfile(owner);

        // Save image if exists
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UploadImage.upload(imageFile, uploadDir, "events");
            event.setThumbnailUrl("/events/" + fileName);
        }

        eventRepository.save(event);
    }

}
