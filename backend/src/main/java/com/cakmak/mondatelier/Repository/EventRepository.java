package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
Query query = entitymanager.createQuery( "Select e " + "from Employee e " + "where e.salary " + "Between 30000 and 40000" );
*/
// custom query for by city + weekNumber
// another one for by city + date
@Repository
public interface EventRepository extends JpaRepository<Event, String> {


    List<Event> getEventByCity(String city);
}
