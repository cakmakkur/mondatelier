package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.City;
import com.cakmak.mondatelier.Model.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {

    List<Event> findByCity(City city);

    // Events by city and week number (ISO week)
    @Query("SELECT e FROM Event e WHERE e.city = :city AND FUNCTION('WEEK', e.date) = :weekNumber AND FUNCTION('YEAR', e.date) = :year")
    List<Event> findByCityAndWeekNumber(
            @Param("city") City city,
            @Param("weekNumber") Integer weekNumber,
            @Param("year") Integer year
    );

    // Events by city and month/year
    @Query("SELECT e FROM Event e WHERE e.city = :city AND FUNCTION('MONTH', e.date) = :month AND FUNCTION('YEAR', e.date) = :year")
    List<Event> findByCityAndMonthYear(
            @Param("city") City city,
            @Param("month") Integer month,
            @Param("year") Integer year
    );
}
