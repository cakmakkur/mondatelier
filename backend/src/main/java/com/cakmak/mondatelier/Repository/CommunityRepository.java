package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.community.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    Page<Community> findByNameContainingIgnoreCase(String query, Pageable pageable);
}
