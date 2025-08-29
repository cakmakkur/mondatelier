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

    @Query(value = """
        SELECT * 
        FROM events e
        WHERE e.city_id = :cityId
          AND EXTRACT(WEEK FROM e.date) = :weekNumber
        """, nativeQuery = true)
    List<Event> findByCityAndWeekNumber(
            @Param("cityId") Long cityId,
            @Param("weekNumber") int weekNumber
    );

    // Events by city and month/year
    @Query("SELECT e FROM Event e WHERE e.city = :city AND FUNCTION('MONTH', e.date) = :month AND FUNCTION('YEAR', e.date) = :year")
    List<Event> findByCityAndMonthYear(
            @Param("city") City city,
            @Param("month") Integer month,
            @Param("year") Integer year
    );
}
