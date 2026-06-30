package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.types.CommunityNotFoundException;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Model.community.Community;
import com.cakmak.mondatelier.Model.community.CommunityProfile;
import com.cakmak.mondatelier.Repository.CommunityProfileRepository;
import com.cakmak.mondatelier.Repository.CommunityRepository;
import com.cakmak.mondatelier.Repository.PostRepository;
import com.cakmak.mondatelier.Repository.ProfileRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.CommunityDto;
import com.cakmak.mondatelier.util.UploadImage;
import jakarta.transaction.Transactional;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Getter
@Service
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final PostRepository postRepository;
    private final CommunityProfileRepository communityProfileRepository;
    private final ProfileRepository profileRepository;

    private volatile List<CommunityDto> topCommunities = List.of();

    @Value("${app.upload.dir}")
    private String uploadDir;


    public CommunityService(
            CommunityRepository communityRepository,
            PostRepository postRepository,
            CommunityProfileRepository communityProfileRepository,
            ProfileRepository profileRepository) {
        this.communityRepository = communityRepository;
        this.postRepository = postRepository;
        this.communityProfileRepository = communityProfileRepository;
        this.profileRepository = profileRepository;
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

        topCommunities = List.copyOf(newTopCommunities);
    }

    public List<CommunityDto> getMyCommunities (String profileId) {
        List<CommunityProfile> communityProfiles = communityProfileRepository.findByProfile_Id(profileId);
        List<CommunityDto> communityDtos = new ArrayList<>();
        for (CommunityProfile communityProfile : communityProfiles) {
            communityDtos.add(DTOMappers.toCommunityDTO(communityProfile.getCommunity()));
        }
        return communityDtos;
    }

    public CommunityDto getCommunityById(Long communityId) {
        Community c = communityRepository.findById(communityId)
                .orElseThrow(CommunityNotFoundException::new);
        return DTOMappers.toCommunityDTO(c);
    }

    @Transactional
    public void followCommunity(Long communityId, User user) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(CommunityNotFoundException::new);

        Profile profile = user.getProfile();

        CommunityProfile cpExists = communityProfileRepository.findByProfileAndCommunity(profile, community);
        if (cpExists != null) {
            throw new CommunityNotFoundException("Already liked");
        }

        CommunityProfile cp = new CommunityProfile();
        cp.setProfile(profile);
        cp.setCommunity(community);

        communityProfileRepository.save(cp);
    }

    @Transactional
    public void unfollowCommunity(Long communityId, User user) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new CommunityNotFoundException("Community not found"));

        Profile profile = user.getProfile();

        CommunityProfile cp = communityProfileRepository.findByProfileAndCommunity(profile, community);

        if (cp == null) {
            throw new CommunityNotFoundException("Already unliked");
        }

        communityProfileRepository.delete(cp);
    }

    @Transactional
    public Page<CommunityDto> query(String query, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<Community> communities = communityRepository.findByNameContainingIgnoreCase(query, pageable);

        return communities.map(DTOMappers::toCommunityDTO);
    }


    @Transactional
    public void createCommunity(
            User user,
            CommunityDto communityDto,
            MultipartFile imageFile) {

        Profile profile = user.getProfile();

        Community c = new Community();
        c.setName(communityDto.name());
        c.setDescription(communityDto.description());
        c.setProfile(profile);


        // Save image if exists
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UploadImage.upload(imageFile, uploadDir, "communities");
            c.setLogoImgPath("/communities/" + fileName);
        }

        communityRepository.save(c);

    }

}
