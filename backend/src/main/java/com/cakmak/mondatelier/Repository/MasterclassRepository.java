package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.Masterclass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MasterclassRepository extends JpaRepository<Masterclass, String> {
    List<Masterclass> findByProfile_Id(String profileId);
}
