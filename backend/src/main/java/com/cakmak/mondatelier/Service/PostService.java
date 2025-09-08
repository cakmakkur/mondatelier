package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Model.community.CommunityProfile;
import com.cakmak.mondatelier.Model.community.Post;
import com.cakmak.mondatelier.Repository.CommunityProfileRepository;
import com.cakmak.mondatelier.Repository.PostRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.PostDto;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Service
public class PostService {

    private final PostRepository postRepository;
    private final CommunityProfileRepository communityProfileRepository;

    public PostService(
            PostRepository postRepository,
            CommunityProfileRepository communityProfileRepository) {
        this.postRepository = postRepository;
        this.communityProfileRepository = communityProfileRepository;
    }

    public List<PostDto> getFeed(LocalDateTime lastCreatedAt, Long lastId) {
        final int LIMIT = 15;
        List<Post> nextBatch = new ArrayList<>();

        if (lastId == null || lastCreatedAt == null) {
            nextBatch = postRepository.findFirstBatch(LIMIT);
        } else {
            nextBatch = postRepository.findNextBatch(lastCreatedAt, lastId, LIMIT);
        }

        if(nextBatch.isEmpty()) throw new RuntimeException("Next batch is empty");

        List<PostDto> postDtos = new ArrayList<>();
        for (Post post : nextBatch) {
            postDtos.add(DTOMappers.toPostDTO(post));
        }

        return postDtos;
    }

    public List<PostDto> getMyFeed(String profileId) {
        List<CommunityProfile> communities = communityProfileRepository.findByProfile_Id(profileId);

        List<Long> communityIds = communities.stream()
                .map(cp -> cp.getCommunity().getId())
                .toList();

        List<Post> posts = new ArrayList<>();
        for (Long communityId : communityIds) {
            posts.addAll(postRepository.findMostRecent25FromMyCommunities(communityId));
        }

        return posts.stream()
                .map(DTOMappers::toPostDTO)
                .toList();
    }

}
