package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.community.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

}
