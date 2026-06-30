package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.City;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Model.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {

    List<Event> findByCity(City city);

    List<Event> findByCityAndDateGreaterThanEqualAndDateLessThanOrderByDate(
            City city,
            Date start,
            Date end);

    List<Event> findTop5ByDateGreaterThanEqualOrderByDateAsc(Date date);

    List<Event> findByProfile(Profile profile);
}
