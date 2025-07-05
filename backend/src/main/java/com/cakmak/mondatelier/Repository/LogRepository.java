package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {
}
