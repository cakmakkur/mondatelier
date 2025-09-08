package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Model.community.Community;
import com.cakmak.mondatelier.Model.community.CommunityProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityProfileRepository extends JpaRepository<CommunityProfile, Long> {
    List<CommunityProfile> findByProfile_Id(String profileId);
    CommunityProfile findByProfileAndCommunity(Profile profile, Community community);
}
