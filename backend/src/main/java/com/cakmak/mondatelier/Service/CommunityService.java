package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Model.community.Community;
import com.cakmak.mondatelier.Model.community.CommunityProfile;
import com.cakmak.mondatelier.Repository.CommunityProfileRepository;
import com.cakmak.mondatelier.Repository.CommunityRepository;
import com.cakmak.mondatelier.Repository.PostRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.CommunityDto;
import com.cakmak.mondatelier.dto.PostDto;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Getter
@Service
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final PostRepository postRepository;
    private final CommunityProfileRepository communityProfileRepository;

    private final List<CommunityDto> topCommunities = new ArrayList<>();

    public CommunityService(
            CommunityRepository communityRepository,
            PostRepository postRepository,
            CommunityProfileRepository communityProfileRepository) {
        this.communityRepository = communityRepository;
        this.postRepository = postRepository;
        this.communityProfileRepository = communityProfileRepository;
    }

    // makes sure it runs once after right after service is initialised
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        updateTopCommunities();
    }

    @Scheduled(cron = "0 0 */6 * * *")
    public void updateTopCommunities() {
        List<CommunityDto> newTopCommunities = new ArrayList<>();

        postRepository.findTop10Communities().forEach(result -> {
            communityRepository.findById(result.getCommunityId()).ifPresent(c -> {
                newTopCommunities.add(DTOMappers.toCommunityDTO(c));
            });
        });

        topCommunities.clear();
        topCommunities.addAll(newTopCommunities);
    }

    public List<CommunityDto> getMyCommunities (String profileId) {
        List<CommunityProfile> communityProfiles = communityProfileRepository.findByProfile_Id(profileId);
        List<CommunityDto> communityDtos = new ArrayList<>();
        for (CommunityProfile communityProfile : communityProfiles) {
            communityDtos.add(DTOMappers.toCommunityDTO(communityProfile.getCommunity()));
        }
        return communityDtos;
    }


}
