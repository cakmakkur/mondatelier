package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.CommunityNotFoundException;
import com.cakmak.mondatelier.Exception.PostNotFoundException;
import com.cakmak.mondatelier.Model.community.Community;
import com.cakmak.mondatelier.Model.community.CommunityProfile;
import com.cakmak.mondatelier.Model.community.Post;
import com.cakmak.mondatelier.Repository.CommunityProfileRepository;
import com.cakmak.mondatelier.Repository.CommunityRepository;
import com.cakmak.mondatelier.Repository.PostRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.CommunityDto;
import com.cakmak.mondatelier.dto.PostDto;
import jakarta.transaction.Transactional;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.convert.Bucket;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Service
public class PostService {

    private final PostRepository postRepository;
    private final CommunityProfileRepository communityProfileRepository;
    private final CommunityRepository communityRepository;

    public PostService(
            PostRepository postRepository,
            CommunityProfileRepository communityProfileRepository,
            CommunityRepository communityRepository) {
        this.postRepository = postRepository;
        this.communityProfileRepository = communityProfileRepository;
        this.communityRepository = communityRepository;
    }

    public List<PostDto> getFeed(LocalDateTime lastCreatedAt, Long lastId) {
        final int LIMIT = 15;
        List<Post> nextBatch = new ArrayList<>();

        if (lastId == null || lastCreatedAt == null) {
            nextBatch = postRepository.findFirstBatch(LIMIT);
        } else {
            nextBatch = postRepository.findNextBatch(lastCreatedAt, lastId, LIMIT);
        }

        if(nextBatch.isEmpty()) throw new PostNotFoundException();

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

    public PostDto getPostById(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(PostNotFoundException::new);
        return DTOMappers.toPostDTO(post);
    }

    public List<PostDto> getByCommunityId(Long communityId) {
        Community c = communityRepository.findById(communityId).orElse(null);
        if (c == null) throw new CommunityNotFoundException();

        List<Post> posts = postRepository.findByCommunity(c);
        if (posts.isEmpty()) throw new PostNotFoundException();

        List<PostDto> postDtos = new ArrayList<>();
        for (Post post : posts) {
            postDtos.add(DTOMappers.toPostDTO(post));
        }

        return postDtos;
    }

    @Transactional
    public Page<PostDto> query(String query, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<Post> posts = postRepository.findByTitleContainingIgnoreCase(query, pageable);

        if (posts.isEmpty()) {
            throw new PostNotFoundException("Post not found");
        }

        return posts.map(DTOMappers::toPostDTO);
    }
}
