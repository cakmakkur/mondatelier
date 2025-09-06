package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Repository.CommunityRepository;
import com.cakmak.mondatelier.Repository.PostRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.CommunityDto;
import lombok.Getter;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Getter
public class CommunityService {

    private CommunityRepository communityRepository;
    private PostRepository postRepository;

    private List<CommunityDto> topCommunities = new ArrayList<>();

    public CommunityService(
            CommunityRepository communityRepository,
            PostRepository postRepository) {
        this.communityRepository = communityRepository;
        this.postRepository = postRepository;
    }

    @Scheduled(cron = "0 0 */6 * * *")
    public void updateTopCommunities() {
        List<CommunityDto> newTopCommunities = new ArrayList<>();
        postRepository.findTop10Communities().forEach(community -> {
            newTopCommunities.add(DTOMappers.toCommunityDTO(community));
        });
        topCommunities.clear();
        topCommunities.addAll(newTopCommunities);
    }

}
