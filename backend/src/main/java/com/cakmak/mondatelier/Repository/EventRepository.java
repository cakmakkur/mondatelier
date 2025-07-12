package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {
}
