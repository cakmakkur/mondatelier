package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.Freelance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FreelanceRepository extends JpaRepository<Freelance, String> {
    List<Freelance> findByProfile_Id(String profileId);
}
